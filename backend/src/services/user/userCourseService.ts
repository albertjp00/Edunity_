import { IMyCourses } from '../../interfaces/userInterfaces';
import { ICourse} from '../../models/course';
import { IFavourite } from '../../models/favourites';
import { IInstructor } from '../../models/instructor';
import { IMyCourse, IProgress } from '../../models/myCourses';
import { IUser } from '../../models/user';
import { AdminRepository } from '../../repositories/adminRepositories';
import { InstructorRepository } from '../../repositories/instructorRepository';
import { UserRepository } from '../../repositories/userRepository';
import razorpay from '../../utils/razorpay';
import crypto from 'crypto'
import fs from 'fs';
import PDFDocument from 'pdfkit'

import path from "path";
import { fileURLToPath } from "url";
import { generateCertificate } from '../../utils/certificate';
import { generateSignedUrl } from '../../utils/getSignedUrl';
import { IUserCourseService } from '../../interfacesServices.ts/userServiceInterfaces';
import { StatusMessage } from '../../enums/statusMessage';
import { IReview } from '../../models/review';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export interface ICourseDetails extends ICourse {
  instructor: IInstructor | null;
  hasAccess: boolean;
  completedModules: string[];
}


export interface IviewCourse {
  course: ICourse,
  instructor: IInstructor
  progress: IProgress
  cancelCourse: boolean
  quizExists: boolean
  enrolledAt: Date
  review:IReview[] | null
}


export class UserCourseService implements IUserCourseService {
  private userRepository: UserRepository;
  private instructorRepository: InstructorRepository;
  private adminRepository: AdminRepository;

  constructor(
    userRepository: UserRepository,
    instructorRepository: InstructorRepository,
    adminRepository: AdminRepository) {

    this.userRepository = userRepository;
    this.instructorRepository = instructorRepository;
    this.adminRepository = adminRepository

  }

  async getCourses(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const courses = await this.userRepository.getCourses(skip, limit);
    const totalCourses = await this.userRepository.countCourses();
    const skills = await this.userRepository.findSkills();


    // console.log('courses', courses);


    return {
      courses,
      skills,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    };
  }


  async getAllCourses(query: any, page: number, limit: number, sortOption: any) {
    const skip = (page - 1) * limit;
    // console.log('all course ', query);

    const courses = await this.userRepository.getAllCourses(query, skip, limit, sortOption);
    // const totalCount = await this.userRepository.countCourses(query);
    const totalCount = await this.userRepository.countAllCourses(query);
    // const totalCount = courses.length

    // console.log(courses);



    return {
      courses,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }


  mySubscriptionCoursesRequest = async (id: string, page: number): Promise<any> => {
    try {
      const courses = await this.userRepository.getSubscriptionCourses(id, page)
      return courses
    } catch (error) {
      console.log(error);

    }
  }




  fetchCourseDetails = async (userId: string, courseId: string): Promise<ICourseDetails | string | null> => {
    try {
      console.log("service get course details");
      let hasAccess = false
      const myCourse: IMyCourse | null = await this.userRepository.getCourseDetails(userId, courseId);

      const completedModules = myCourse?.progress?.completedModules || [];

      if(myCourse){
        return 'myCourseExists'
      }


      const course: any = await this.userRepository.getCourse(courseId);
      // console.log('myCoursessss', course);

      if (course.accessType == 'subscription') {
        const userSubscription = await this.userRepository.getSubscriptionActive(userId)
        if (userSubscription) {
          hasAccess = true
        }
      }

      

      if (myCourse) {
        hasAccess = true
      }

      const instructor = await this.instructorRepository.findById(course.instructorId);
      return {
        ...(course.toObject?.() || course),
        instructor,
        hasAccess,
        completedModules
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };






  // import OrderModel from "../models/orderModel"; // adjust path

  buyCourseRequest = async (userId: string, courseId: string) => {
    try {
      console.log('buy course service');

      const courseCount = await this.userRepository.getMyCoursesCount(userId)
      if (courseCount < 5) {
        const course = await this.userRepository.getCourse(courseId);
        if (!course) {
          throw new Error(StatusMessage.COURSE_NOT_FOUND);
        }
        if (course.onPurchase) {
          throw new Error(StatusMessage.PAYMENT_ALREADY_PROGRESS)
        }



        const options = {
          amount: course.price! * 100,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: { userId, courseId },
        };


        const order = await razorpay.orders.create(options);

        const onPurchase = await this.userRepository.onPurchase(courseId, true)

        return order;
      }

    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  cancelPayment = async (courseId: string): Promise<void> => {
    try {
      const result = await this.userRepository.cancelPurchase(courseId)
    } catch (error) {
      console.log(error);

    }
  }



  verifyPaymentRequest = async (razorpay_order_id: string, razorpay_payment_id: string,
    razorpay_signature: string, courseId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    try {

      console.log('verify payment ',courseId , userId);
      
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign.toString())
        .digest("hex");

        console.log('check equal ',expectedSign , razorpay_signature);
        

      if (razorpay_signature === expectedSign) {
        const course = await this.userRepository.getCourse(courseId)
        console.log('buyin course ',course);
      
        if (!course) {
          return { success: false, message: StatusMessage.COURSE_NOT_FOUND };
        }
        const updateEnrolled = await this.userRepository.buyCourse(courseId)

        await this.userRepository.addMyCourse(userId, course);

        const instructorId = course.instructorId as string

        const ADMIN_COMMISSION_RATE = 0.2;
        const coursePrice = course.price ?? 0;

        const adminEarning = coursePrice * ADMIN_COMMISSION_RATE;
        const instructorEarning = coursePrice - adminEarning;

        //adminEarnings
        const adminEarningsUpdate = await this.adminRepository.updateEarnings(courseId, coursePrice, instructorId,
          instructorEarning, adminEarning)

        //   const wallet = await this.instructorRepository.addToWallet(instructorId, {
        //   type: "credit",
        //   amount: instructorEarning,
        //   courseId,
        //   description: `Earnings of course: ${course.title}`,
        // });

        const courseName = course.title
        const payment = await this.userRepository.userPayment(userId, courseId, courseName, coursePrice)

        //notification
        const title = "Course Purchased"
        const message = `You have successfully purchased the course "${course?.title}`
        const notification = await this.userRepository.sendNotification(userId, title, message)
        const onPurchase = await this.userRepository.onPurchase(courseId, false)

        return { success: true, message: StatusMessage.COURSE_ADDED };
      } else {
        return { success: false, message: StatusMessage.INVALID_SIGNATURE };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: StatusMessage.PAYMENT_VERIFICATION_FAILURE }

    }

  }


  //subscription
  buySubscriptionRequest = async (userId: string) => {
    try {
      const options = {
        amount: 39900,  // ₹399
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
    userId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
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
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      }

      console.log('verify service ', data);



      await this.userRepository.updateSubscription(userId, data);

      await this.userRepository.sendNotification(
        userId,
        "Subscription Activated",
        "Your premium subscription is now active!"
      );

      return { success: true, message: "Subscription Activated" };

    } catch (error) {
      console.error(error);
      return { success: false, message: "Subscription Verification Failed" };
    }
  };






  myCoursesRequest = async (id: string, page: number): Promise<{ populatedCourses: IMyCourse[], result: IMyCourses } | null> => {
    try {

      const result = await this.userRepository.findMyCourses(id, page)
      // console.log("courseIdd ", myCourses);

      if (!result.myCourses || result.myCourses.length === 0) return { populatedCourses: [], result };
      const populatedCourses = await Promise.all(
        result.myCourses.map(async (mc) => {
          const course = await this.userRepository.getCourse(mc.courseId.toString());
          return {
            ...mc.toObject?.() || mc,
            course,
          };
        })
      );
      // console.log("my Courses ", populatedCourses);

      return { populatedCourses, result };

    } catch (error) {
      console.log(error);
      return null
    }
  }

  viewMyCourseRequest = async (
    id: string,
    myCourseId: string
  ): Promise<IviewCourse | null> => {
    try {
      console.log('service myCourse viewMyCourse');

      const myCourse = await this.userRepository.viewMyCourse(id, myCourseId);
      if (!myCourse) return null;
      const progress = myCourse.progress
      const cancelCourse = myCourse.cancelCourse
      // console.log('service my course details',myCourse);
      const enrolledAt = myCourse.createdAt

      // const myCourse = await this.userRepository.findUserCourse(userId, courseId);

      const course = await this.userRepository.getCourse(myCourse.courseId.toString());
      if (!course) return null;


      if (course.modules && course.modules.length > 0) {
        for (const module of course.modules) {
          const rawUrl = module.videoUrl;

          if (rawUrl) {

            let key: string | undefined;

            if (rawUrl.includes(".amazonaws.com/")) {
              const parts = rawUrl.split(".amazonaws.com/");
              key = parts[1]?.split("?")[0]; // safely access
            } else {
              key = rawUrl.split("?")[0]; // fallback for direct key
            }
            console.log("key", key);

            if (key) {
              module.videoUrl = await generateSignedUrl(key);
            }
          }
        }
      }



      const instructor = await this.instructorRepository.findById(course.instructorId as string);
      if (!instructor) return null;

      const quiz = await this.userRepository.getQuiz(course.id)
      console.log(quiz);
      let quizExists = false
      if (quiz) {
        quizExists = true
      }

      const review = await this.userRepository.getReview(id,course.id)

      

      return { course, review , instructor, progress, cancelCourse, quizExists, enrolledAt };
    } catch (error) {
      console.log(error);
      return null;
    }
  };



  async updateProgress(userId: string, courseId: string, moduleTitle: string) {

    try {
      const update = await this.userRepository.updateProgress(userId, courseId, moduleTitle)

      return update
    } catch (error) {
      console.log(error);

    }
  }


  async getCertificateRequest(userId: string, courseId: string) {
    try {

      const myCourse = await this.userRepository.findUserCourse(userId, courseId);

      if (!myCourse) {
        return { success: false, message: StatusMessage.COURSE_NOT_FOUND };
      }

      let filePath = myCourse.certificate;

      if (!filePath) {
        const course = await this.userRepository.getCourse(courseId);
        const user = await this.userRepository.findById(userId);

        const totalModules = course?.modules?.length || 0;
        const completedModules = myCourse?.progress?.completedModules?.length || 0;

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
          courseId
        );
        const fileName = path.basename(filePath);

        await this.userRepository.getCertificate(userId, courseId, fileName);
      }
      filePath = path.basename(filePath);

      return { filePath };

    } catch (error) {
      console.error(error);
      return { success: false, message: StatusMessage.ERROR_CERTIFICATE };
    }
  }

  async addReview(userId: string, courseId: string, rating: number, review: string): Promise<IReview | null | string | undefined> {

    try {
      console.log('in servire review');
      
    //   const courseReview = await this.userRepository.getCourse(courseId)
    //   console.log(courseReview);
      
    //   const reviewed = courseReview?.review.some((r:IReview)=>  r.userId === userId )
      
    //   console.log('reviewdddd',reviewed);
      
    //   if (reviewed) {
    //   return 'exists'
    // }

      const user = await this.userRepository.findById(userId)
      if (user) {
        const userName = user.name
        const userImage = user.profileImage || ''


        let addedReview = await this.userRepository.addReview(userId, userName, userImage, courseId, rating, review)
        return addedReview

      }


      
    } catch (error) {
      console.log(error);
      return null
    }
  }



  async getInstructorsRequest(): Promise<IInstructor[] | null> {

    try {
      const update = await this.userRepository.findInstructors()

      return update
    } catch (error) {
      console.log(error);
      return null
    }
  }



    async addtoFavourites(userId: string, courseId: string): Promise<string | null> {
      try {
        // console.log('add to fav');

        const result = await this.userRepository.addtoFavourites(userId, courseId);

        // if (result == 'existing') {
        //   return result;
        // }

        return result
      } catch (error) {
        console.log(error);
        return null
        // return { success: false, message: StatusMessage.INTERNAL_SERVER_ERROR };
      }
    }

  async getFavourites(userId: string): Promise<IFavourite[] | null> {
    try {
      console.log('get fav');

      const result = await this.userRepository.getFavourites(userId);

      if (!result || result.length === 0) return [];
      const populatedCourses = await Promise.all(
        result.map(async (mc) => {
          const course = await this.userRepository.getCourse(mc.courseId.toString());
          return {
            ...mc.toObject?.() || mc,
            course,
          };
        })
      );



      return populatedCourses
    } catch (error) {
      console.log(error);
      return null
    }
  }

  favCourseDetails = async (userId: string, courseId: string): Promise<ICourseDetails | boolean | null> => {
    try {
      // console.log();
      let hasAccess = false
      const myCourse = await this.userRepository.getCourseDetails(userId, courseId);
      console.log(myCourse);
      const favCourse = await this.userRepository.getFavCourseDetails(userId, courseId);
      if(!favCourse){
        return false
      }


      const course: any = await this.userRepository.getCourse(courseId);
      // console.log('myCoursessss', course);


      if (myCourse) {
        hasAccess = true
      }

      const instructor = await this.instructorRepository.findById(course.instructorId);

      return {
        ...(course.toObject?.() || course),
        instructor,
        hasAccess,
        completedModules: []
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };


  getQuiz = async (courseId: string) => {
    try {
      // console.log('quiz service');

      // const course = await this.userRepository.getCourse(myCourseId)
      // console.log(course);

      // if(!course) return null
      const quiz = await this.userRepository.getQuiz(courseId)
      console.log(quiz);

      return quiz
    } catch (error) {
      console.log(error);

    }
  }

  submitQuiz = async (
    userId: string,
    courseId: string,
    quizId: string,
    answers: any
  ) => {
    try {
      console.log("quiz service", answers);

      const quiz = await this.userRepository.getQuiz(courseId);
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
        console.log("QID:", q._id.toString(), "Correct:", q.correctAnswer, "User:", userAnswer);

        if (
          userAnswer &&
          userAnswer.toString().trim().toLowerCase() === q.correctAnswer.toString().trim().toLowerCase()
        ) {
          score += q.points;
        }
      });



      await this.userRepository.submitQuiz(userId, courseId, score);

      return { score, totalPoints };
    } catch (error) {
      console.error("Error in submitQuiz service:", error);
      throw error;
    }
  };


  async cancelCourseRequest(userId: string, courseId: string): Promise<void> {
    const enrollment = await this.userRepository.findUserCourse(userId, courseId);
    if (!enrollment) throw new Error(StatusMessage.NOT_ENROLLED);

    const course = await this.userRepository.getCourse(courseId);
    if (!course) throw new Error(StatusMessage.COURSE_NOT_FOUND);

    // Refund only if paid
    if (course.price && course.price > 0) {
      await this.userRepository.addTransaction(userId, {
        type: "credit",
        amount: course.price,
        courseId,
        description: `Refund for canceled course: ${course.title}`,
      });
    }

    await this.userRepository.removeUserCourse(userId, courseId);

    // Decrease total enrolled count
    await this.userRepository.decreaseCourseEnrollment(courseId);
  }

}
