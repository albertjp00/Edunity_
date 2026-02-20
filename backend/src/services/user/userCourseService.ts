import {
  IMyCourses,
  IRazorpayOrder,
  ISubscriptionCoursesService,
  IUserRepository,
  SortOption,
} from "../../interfaces/userInterfaces";
import { ICourse } from "../../models/course";
import { IMyCourse } from "../../models/myCourses";
import {   ISkills } from "../../repositories/instructorRepository";
import razorpay from "../../utils/razorpay";
import crypto from "crypto";
import path from "path";
import { generateCertificate } from "../../utils/certificate";
import { generateSignedUrl } from "../../utils/getSignedUrl";
import {
  IUserCourseService,
  IviewCourse,
} from "../../interfacesServices.ts/userServiceInterfaces";
import { StatusMessage } from "../../enums/statusMessage";
import { IReview } from "../../models/review";
import { IReport } from "../../models/report";
import { FilterQuery } from "mongoose";
import {
  mapAllCourseToDTO,
  mapCourseToViewDTO,
  mapFavoriteToDTO,
  mapMyCoursesListToDTO,
  mapQuizToDTO,
  mapSubscriptionCourseToDTO,
  mapUserInstructorDto,
} from "../../mapper/user.mapper";
import {
  FavoriteCourseDTO,
  MyCourseDTO,
  QuizUserDTO,
  UserInstructorDTO,
} from "../../dto/userDTO";
import { IAdminRepository } from "../../interfacesServices.ts/adminServiceInterfaces";
import { IInsRepository } from "../../interfacesServices.ts/instructorServiceInterface";
import { ISubscriptionPlan } from "../../models/subscription";


export interface ICourseDetails extends ICourse {
  hasAccess: boolean;
}

export class UserCourseService implements IUserCourseService {

  constructor(
    private _userRepository: IUserRepository,
    private _instructorRepository: IInsRepository,
    private _adminRepository: IAdminRepository,
  ) {}

  async getCourses(page: number, limit: number): Promise<{
          courses: ICourse[] | null;
          skills: ISkills;
          totalPages: number;
          currentPage: number;
      } | null> {
    try {
      const skip = (page - 1) * limit;

    const courses = await this._userRepository.getCourses(skip, limit);
    const totalCourses = await this._userRepository.countCourses();
    const skills = await this._userRepository.findSkills();

    return {
      courses,
      skills,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    };
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getAllCourses(
    query: FilterQuery<ICourse>,
    page: number,
    limit: number,
    sortOption: SortOption,
  ) {
    try {
      const skip = (page - 1) * limit;

    const courses = await this._userRepository.getAllCourses(
      query,
      skip,
      limit,
      sortOption,
    );
    if(!courses) return null

    const totalCount = await this._userRepository.countAllCourses(query);

    return {
      courses: courses.map(mapAllCourseToDTO),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
    } catch (error) {
      console.log(error);
      return null
    }
  }

  mySubscriptionCoursesRequest = async (
    id: string,
    page: number,
  ): Promise<ISubscriptionCoursesService | null> => {
    try {
      const result = await this._userRepository.getSubscriptionCourses(id, page);
      if (!result) return null;

      const courses = result?.courses;

      const totalPages = result?.totalPages;
      console.log(courses[0]?.modules);

      return { courses: courses?.map(mapSubscriptionCourseToDTO), totalPages };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  fetchCourseDetails = async (
    userId: string,
    courseId: string,
  ): Promise<ICourseDetails | string | null> => {
    try {
      let hasAccess = false;
      const myCourse: IMyCourse | null =
        await this._userRepository.getCourseDetails(userId, courseId);

      const completedModules = myCourse?.progress?.completedModules || [];

      if (myCourse) {
        return "myCourseExists";
      }

      const course = await this._userRepository.getCourse(courseId);
      if (!course) return null;

      if (course?.accessType == "subscription") {
        const userSubscription =
          await this._userRepository.getSubscriptionActive(userId);
        if (userSubscription) {
          hasAccess = true;
        }
      }

      if (myCourse) {
        hasAccess = true;
      }

      const instructor = await this._instructorRepository.findById(
        course?.instructorId as string,
      );
      return {
        ...(course.toObject?.() || course),
        instructor,
        hasAccess,
        completedModules,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  buyCourseRequest = async (
    userId: string,
    courseId: string,
  ): Promise<IRazorpayOrder> => {
    try {
      const course = await this._userRepository.getCourse(courseId);

      if (!course) {
        throw new Error(StatusMessage.COURSE_NOT_FOUND);
      }
      if (course.onPurchase) {
        throw new Error(StatusMessage.PAYMENT_ALREADY_PROGRESS);
      }

      const options = {
        amount: course.price! * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { userId, courseId },
      };

      const order = await razorpay.orders.create(options);

      await this._userRepository.onPurchase(courseId, true);

      return order;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  cancelPayment = async (courseId: string): Promise<void> => {
    try {
      await this._userRepository.cancelPurchase(courseId);
    } catch (error) {
      console.log(error);
    }
  };

  verifyPaymentRequest = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    courseId: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        const course = await this._userRepository.getCourse(courseId);

        if (!course) {
          return { success: false, message: StatusMessage.COURSE_NOT_FOUND };
        }
        await this._userRepository.buyCourse(courseId);

        await this._userRepository.addMyCourse(userId, course);

        const instructorId = course.instructorId as string;

        const ADMIN_COMMISSION_RATE = 0.2;
        const coursePrice = course.price ?? 0;

        const adminEarning = coursePrice * ADMIN_COMMISSION_RATE;
        const instructorEarning = coursePrice - adminEarning;

        //adminEarnings
        await this._adminRepository.updateEarnings(
          courseId,
          coursePrice,
          instructorId,
          instructorEarning,
          adminEarning,
        );


        const courseName = course.title;
        await this._userRepository.userPayment(
          userId,
          courseId,
          courseName,
          coursePrice,
        );

        //notification
        const title = "Course Purchased";
        const message = `You have successfully purchased the course "${course?.title}`;
        await this._userRepository.sendNotification(
          userId,
          title,
          message,
        );
        await this._userRepository.onPurchase(
          courseId,
          false,
        );

        return { success: true, message: StatusMessage.COURSE_ADDED };
      } else {
        return { success: false, message: StatusMessage.INVALID_SIGNATURE };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: StatusMessage.PAYMENT_VERIFICATION_FAILURE,
      };
    }
  };

  //subscription
  buySubscriptionRequest = async (userId: string) => {

    const plan = await this._userRepository.getSubscriptionPlan()
    if(!plan) return null

    try {
      const options = {
        amount: plan?.price * 100, // ₹399
        currency: "INR",
        receipt: `subscription_${Date.now()}`,
        notes: { userId },
      };

      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  verifySubscriptionPaymentRequest = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    userId: string,
  ): Promise<{ success: boolean; message: string } | null> => {
    try {

      const plan = await this._userRepository.getSubscriptionPlan()
    if(!plan) return null

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign)
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        return { success: false, message: "Invalid Payment Signature" };
      }

      const data = {
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + plan?.durationInDays * 24 * 60 * 60 * 1000),
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      };

      await this._userRepository.updateSubscription(userId, data);

      await this._userRepository.sendNotification(
        userId,
        "Subscription Activated",
        "Your premium subscription is now active!",
      );

      return { success: true, message: "Subscription Activated" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Subscription Verification Failed" };
    }
  };

  myCoursesRequest = async (
    id: string,
    page: number,
  ): Promise<{
    populatedCourses: MyCourseDTO[];
    result: IMyCourses;
  } | null> => {
    try {
      const result = await this._userRepository.findMyCourses(id, page);
      if(!result) return null

      if (!result?.myCourses || result.myCourses.length === 0)
        return { populatedCourses: [], result };
      const populatedCourses = await Promise.all(
        result.myCourses.map(async (mc) => {
          const course = await this._userRepository.getCourse(
            mc.courseId.toString(),
          );
          return {
            ...(mc.toObject?.() || mc),
            course,
          };
        }),
      );

      const mappedCourses = mapMyCoursesListToDTO(populatedCourses);

      return { populatedCourses: mappedCourses, result };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  viewMyCourseRequest = async (
    id: string,
    myCourseId: string,
  ): Promise<IviewCourse | null> => {
    try {
      const myCourse = await this._userRepository.viewMyCourse(id, myCourseId);

      if (!myCourse) return null;
      const progress = myCourse.progress;
      const cancelCourse = myCourse.cancelCourse;
      const enrolledAt = myCourse.createdAt;

      const course = await this._userRepository.getCourse(
        myCourse.courseId.toString(),
      );
      if (!course) return null;

      if (course.modules && course.modules.length > 0) {
        for (const module of course.modules) {
          const rawUrl = module.videoUrl;

          if (rawUrl) {
            let key: string | undefined;

            if (rawUrl.includes(".amazonaws.com/")) {
              const parts = rawUrl.split(".amazonaws.com/");
              key = parts[1]?.split("?")[0];
            } else {
              key = rawUrl.split("?")[0];
            }
            if (key) {
              module.videoUrl = await generateSignedUrl(key);
            }
          }
        }
      }

      const instructor = await this._instructorRepository.findById(
        course.instructorId as string,
      );
      if (!instructor) return null;

      const quiz = await this._userRepository.getQuiz(course.id);
      console.log(quiz);
      let quizExists = false;
      if (quiz) {
        quizExists = true;
      }

      const review = await this._userRepository.getReview(id, course.id);

      console.log('view course',course);
      

      return {
        course: mapCourseToViewDTO(course),
        review,
        instructor,
        progress,
        cancelCourse,
        quizExists,
        enrolledAt,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  async updateProgress(
    userId: string,
    courseId: string,
    moduleTitle: string,
  ): Promise<boolean | null> {
    try {
      await this._userRepository.updateProgress(userId, courseId, moduleTitle);
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getCertificateRequest(userId: string, courseId: string) {
    try {
      const myCourse = await this._userRepository.findUserCourse(
        userId,
        courseId,
      );

      if (!myCourse) {
        return { success: false, message: StatusMessage.COURSE_NOT_FOUND };
      }

      let filePath = myCourse.certificate;

      if (!filePath) {
        const course = await this._userRepository.getCourse(courseId);
        const user = await this._userRepository.findById(userId);

        const totalModules = course?.modules?.length || 0;
        const completedModules =
          myCourse?.progress?.completedModules?.length || 0;

        if (completedModules < totalModules) {
          return {
            success: false,
            message: StatusMessage.COURSE_NOT_COMPLETED,
          };
        }

        filePath = await generateCertificate(
          user?.name || "Learner",
          course?.title || "Course",
          userId,
          courseId,
        );
        const fileName = path.basename(filePath);

        await this._userRepository.getCertificate(userId, courseId, fileName);
      }
      filePath = path.basename(filePath);

      return { filePath };
    } catch (error) {
      console.error(error);
      return { success: false, message: StatusMessage.ERROR_CERTIFICATE };
    }
  }

  async addReview(
    userId: string,
    courseId: string,
    rating: number,
    review: string,
  ): Promise<IReview | null | string | undefined> {
    try {
      console.log("in servire review");

      const user = await this._userRepository.findById(userId);
      if (user) {
        const userName = user.name;
        const userImage = user.profileImage || "";

        const  addedReview = await this._userRepository.addReview(
          userId,
          userName,
          userImage,
          courseId,
          rating,
          review,
        );
        return addedReview;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getInstructorsRequest(): Promise<UserInstructorDTO[] | null> {
    try {
      const result = await this._userRepository.findInstructors();
      if (!result) return null;

      return result?.map(mapUserInstructorDto);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addtoFavourites(
    userId: string,
    courseId: string,
  ): Promise<string | null> {
    try {
      const result = await this._userRepository.addtoFavourites(
        userId,
        courseId,
      );
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getFavorites(userId: string): Promise<FavoriteCourseDTO[] | null> {
    try {
      const result = await this._userRepository.getFavourites(userId);

      if (!result || result.length === 0) return [];
      const populatedCourses = await Promise.all(
        result.map(async (mc) => {
          const course = await this._userRepository.getCourse(
            mc.courseId.toString(),
          );
          return {
            ...(mc.toObject?.() || mc),
            course,
          };
        }),
      );
      return populatedCourses.map(mapFavoriteToDTO);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  favCourseDetails = async (
    userId: string,
    courseId: string,
  ): Promise<ICourseDetails | boolean | null> => {
    try {
      
      let hasAccess = false;

      const favCourse = await this._userRepository.getFavCourseDetails(
        userId,
        courseId,
      );
      console.log('fav course',favCourse);
      
      if (favCourse) {
        return true;
      }

      

      return hasAccess
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getQuiz = async (courseId: string):Promise<QuizUserDTO | null> => {
    try {
      const quiz = await this._userRepository.getQuiz(courseId);
      if(!quiz) return null
      
      return mapQuizToDTO(quiz);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  submitQuiz = async (userId: string, courseId: string, answers: any) => {
    try {
      const quiz = await this._userRepository.getQuiz(courseId);
      console.log(quiz?.questions);

      if (!quiz) {
        throw new Error("Quiz not found");
      }

      let score = 0;
      let totalPoints = 0;

      // unwrap nested answers if necessary
      const flatAnswers = answers.answers ? answers.answers : answers;

      quiz.questions.forEach((q) => {
        totalPoints += q.points;
        const userAnswer = flatAnswers[q._id.toString()];
        console.log(
          "QID:",
          q._id.toString(),
          "Correct:",
          q.correctAnswer,
          "User:",
          userAnswer,
        );

        if (
          userAnswer &&
          userAnswer.toString().trim().toLowerCase() ===
            q.correctAnswer.toString().trim().toLowerCase()
        ) {
          score += q.points;
        }
      });

      await this._userRepository.submitQuiz(userId, courseId, score);

      return { score, totalPoints };
    } catch (error) {
      console.error("Error in submitQuiz service:", error);
      throw error;
    }
  };

  async cancelCourseRequest(userId: string, courseId: string): Promise<void> {
    const enrollment = await this._userRepository.findUserCourse(
      userId,
      courseId,
    );
    if (!enrollment) throw new Error(StatusMessage.NOT_ENROLLED);

    const course = await this._userRepository.getCourse(courseId);
    if (!course) throw new Error(StatusMessage.COURSE_NOT_FOUND);

    // Refund only if paid
    if (course.price && course.price > 0) {
      await this._userRepository.addTransaction(userId, {
        type: "credit",
        amount: course.price,
        courseId,
        description: `Refund for canceled course: ${course.title}`,
      });
    }

    await this._userRepository.removeUserCourse(userId, courseId);

    // Decrease total enrolled count
    await this._userRepository.decreaseCourseEnrollment(courseId);
  }

  reportCourseRequest = async (
    userId: string,
    courseId: string,
    report: IReport,
  ) => {
    try {
      await this._userRepository.reportCourse(
        userId,
        courseId,
        report,
      );
    } catch (error) {
      console.log(error);
    }
  };

    
}
