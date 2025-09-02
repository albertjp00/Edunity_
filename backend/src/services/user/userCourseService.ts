import { ICourse } from '../../models/course.js';
import { IInstructor } from '../../models/instructor.js';
import { IMyCourse } from '../../models/myCourses.js';
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

  // service
  // services/courseService.ts
  getAllCourses = async (query: any, page: number, limit: number) => {
    try {
      const skip = (page - 1) * limit;

      const courses = await this.userRepository.getAllCourses(query, skip, limit);
      const totalCount = await this.userRepository.countAllCourses(query);
      console.log(courses);


      return {
        courses,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        totalCount
      };
    } catch (error) {
      console.log("Error in courseService.getAllCourses:", error);
      throw error;
    }
  };



  fetchCourseDetails = async (userId: string, courseId: string): Promise<ICourseDetails | null> => {
    try {
      console.log("service get course details");
      let hasAccess = false
      const course: any = await this.userRepository.getCourse(courseId);
      const myCourse = await this.userRepository.getCourseDetails(userId, courseId);
      // console.log('myCoursessss', myCourse);

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
        const course = await this.userRepository.getCourse(courseId)
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

      return myCourses

    } catch (error) {
      console.log(error);
      return null
    }
  }

  viewMyCourseRequest = async (id: string, myCourseId: string): Promise<IMyCourse | null> => {
    try {


      const myCourse = await this.userRepository.viewMyCourse(id, myCourseId)
      // const progress = await this.userRepository.getProgress(id)

      return myCourse

    } catch (error) {
      console.log(error);
      return null
    }
  }

  async updateProgress(userId: string, courseId: string, moduleTitle: string) {

    try {
      const update = await this.userRepository.updateProgress(userId, courseId, moduleTitle)

      return update
    } catch (error) {
      console.log(error);

    }
  }


  async getInstructorsRequest(): Promise<IInstructor[] | null> {

    try {
      const update = await this.adminRepository.findInstructors()

      return update
    } catch (error) {
      console.log(error);
      return null
    }
  }



}
