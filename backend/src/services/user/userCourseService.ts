import { ICourse } from '../../models/course.js';
import { IFavourite } from '../../models/favourites.js';
import { IInstructor } from '../../models/instructor.js';
import { IMyCourse, IProgress } from '../../models/myCourses.js';
import { IUser } from '../../models/user.js';
import { AdminRepository } from '../../repositories/adminRepositories.js';
import { InstructorRepository } from '../../repositories/instructorRepository.js';
import { UserRepository } from '../../repositories/userRepository.js';
import razorpay from '../../utils/razorpay.js';
import crypto from 'crypto'


export interface ICourseDetails extends ICourse {
  instructor: IInstructor | null;
  hasAccess: boolean;
  completedModules: string[];
}


export interface IviewCourse {
  course: ICourse,
  instructor: IInstructor
  progress: IProgress
  quizExists: boolean
}


export class UserCourseService {
  private userRepository: UserRepository;
  private instructorRepository: InstructorRepository;
  private adminRepository: AdminRepository;

  constructor(userRepository: UserRepository, instructorRepository: InstructorRepository, adminRepository: AdminRepository) {
    this.userRepository = userRepository;
    this.instructorRepository = instructorRepository;
    this.adminRepository = adminRepository

  }

  async getCourses(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const courses = await this.userRepository.getCourses(skip, limit);
    const totalCourses = await this.userRepository.countCourses();
    const skills = await this.userRepository.findSkills();


    console.log('courses', courses);


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
    const totalCount = await this.userRepository.countCourses();
    // const totalCount = courses.length

    // console.log(courses);



    return {
      courses,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }




  fetchCourseDetails = async (userId: string, courseId: string): Promise<ICourseDetails | null> => {
    try {
      console.log("service get course details");
      let hasAccess = false
      const myCourse = await this.userRepository.getCourseDetails(userId, courseId);
      // console.log(myCourse);


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
        completedModules: myCourse?.progress?.completedModules || []
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
      const course = await this.userRepository.getCourse(courseId);
      if (!course) {
        throw new Error("Course not found");
      }

      const options = {
        amount: course.price! * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { userId, courseId },
      };

      const order = await razorpay.orders.create(options);

      return order;

    } catch (error) {
      console.error(error);
      throw error;
    }
  };



  verifyPaymentRequest = async (razorpay_order_id: string, razorpay_payment_id: string,
    razorpay_signature: string, courseId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        const course = await this.userRepository.buyCourse(courseId)
        await this.userRepository.addMyCourse(userId, course);

        return { success: true, message: "Payment verified and course added" };
      } else {
        return { success: false, message: "Invalid signature" };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "Payment verification failed" }

    }

  }







  myCoursesRequest = async (id: string): Promise<IMyCourse[] | null> => {
    try {

      const myCourses = await this.userRepository.findMyCourses(id)
      console.log("courseIdd ", myCourses);

      if (!myCourses || myCourses.length === 0) return [];
      const populatedCourses = await Promise.all(
        myCourses.map(async (mc) => {
          const course = await this.userRepository.getCourse(mc.courseId.toString());
          return {
            ...mc.toObject?.() || mc,
            course,
          };
        })
      );
      console.log("my Courses ", populatedCourses);

      return populatedCourses;

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
      const myCourse = await this.userRepository.viewMyCourse(id, myCourseId);
      if (!myCourse) return null;
      const progress = myCourse.progress

      const course = await this.userRepository.getCourse(myCourse.courseId.toString());
      if (!course) return null;

      const instructor = await this.instructorRepository.findById(course.instructorId as string);
      if (!instructor) return null;

      const quiz = await this.userRepository.getQuiz(course.id)
      console.log(quiz);
      let quizExists = false
      if (quiz) {
        quizExists = true
      }


      return { course, instructor, progress, quizExists };
    } catch (error) {
      console.log(error);
      return null;
    }
  };


  async updateProgress(userId: string, myCourseId: string, moduleTitle: string) {

    try {
      const update = await this.userRepository.updateProgress(userId, myCourseId, moduleTitle)

      return update
    } catch (error) {
      console.log(error);

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



  async addtoFavourites(userId: string, courseId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('add to fav');

      const result = await this.userRepository.addtoFavourites(userId, courseId);

      if (!result) {
        return { success: false, message: "Course already in favourites" };
      }

      return { success: true, message: "Added to favourites" };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Something went wrong" };
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

  favCourseDetails = async (userId: string, courseId: string): Promise<ICourseDetails | null> => {
    try {
      console.log("service get course details");
      let hasAccess = false
      const myCourse = await this.userRepository.getCourseDetails(userId, courseId);
      console.log(myCourse);
      const favCourse = await this.userRepository.getFavCourseDetails(userId, courseId);
      console.log(myCourse);


      const course: any = await this.userRepository.getCourse(courseId);
      console.log('myCoursessss', course);


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
      console.log('quiz service');

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




}
