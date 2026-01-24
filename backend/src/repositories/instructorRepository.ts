import { Types } from "mongoose";
import { CourseModel, ICourse } from "../models/course";
import { EventModel, IEvent } from "../models/events";
import { IInstructor, InstructorModel } from "../models/instructor";
import { IKyc, KycModel } from "../models/kyc";
import { IMyCourse, MyCourseModel } from "../models/myCourses";
import { IQuiz, QuizModel } from "../models/quiz";
import { IUser, UserModel } from "../models/user";
import { IEventResult, IPurchaseDetails } from "../interfaces/instructorInterfaces";
import { INotification, NotificationModel } from "../models/notification";
import { EarningModel, IEarnings } from "../models/earnings";
import { IWallet, WalletModel } from "../models/wallet";
import { WalletTransaction } from "../interfaces/userInterfaces";
import { CategoryModel, ICategory } from "../models/category";
// import { IInsRepository } from "../interfaces/instructorInterfaces";


export interface ISkills {
  uniqueSkills: string[] | null;
}

export interface IInsRepository {
  findByEmail(email: string): Promise<IInstructor | null>

  create(instructor: { name: string; email: string; password: string }): Promise<IInstructor | null>

  findById(id: string): Promise<IInstructor | null>

  updateProfile(id: string, data: Partial<IInstructor>): Promise<IInstructor | null>

  updatePassword(id: string, newPassword: string): Promise<IInstructor | null>

  kycSubmit(id: string, idProof: string, addressProof: string): Promise<IKyc | null>

  changePassword(id: string, password: string): Promise<IInstructor | null>



  addCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>


  getCourses(id: string, search : string , skip: number, limit: number): Promise<ICourse[] | null>

  getCourseDetails(courseId: string): Promise<ICourse | null>

  purchaseDetails(courseId: string): Promise<IPurchaseDetails[] | null>

  editCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>

  countCourses(id : string): Promise<number>;

  findSkills(): Promise<ISkills>;

  addEvent(id: string, name: string, data: Partial<IEvent>): Promise<IEvent>

  getMyEvents(id: string, search: string, page: string): Promise<IEventResult | null>

  getEvent(id: string): Promise<IEvent | null>

  updateEvent(id: string, data: any): Promise<IEvent | null>

  addQuiz(courseId: string, title: string, questions: any[]): Promise<IQuiz>

  getQuiz(courseId: string): Promise<IQuiz | null>

  getQuizByCourseId(courseId: string): Promise<IQuiz | null>

  editQuiz(id: string, data: Partial<IQuiz>): Promise<IQuiz>

  startEventById(id: string): Promise<IEvent | null>

  endEventById(id: string): Promise<IEvent | null>

  totalCourses(id: string): Promise<number | null>

  // getMyCourses(id : string):Promise<string[] | null>

  getDashboard(instructorId: string): Promise<any>

  getCategory():Promise<ICategory[] | null>;


}



export class InstructorRepository implements IInsRepository {
  async findByEmail(email: string): Promise<IInstructor | null> {
    const user = await InstructorModel.findOne({ email })
    return user
  }


  async create(instructor: { name: string; email: string; password: string }): Promise<IInstructor> {
    return await InstructorModel.create(instructor);
  }


  async findById(id: string): Promise<IInstructor | null> {
    return await InstructorModel.findById(id);
  }

  async updateProfile(id: string, data: Partial<IInstructor>): Promise<IInstructor | null> {
    return await InstructorModel.findByIdAndUpdate(id, data, { new: true })
  }

  async updatePassword(id: string, newPassword: string): Promise<IInstructor | null> {
    return await InstructorModel.findByIdAndUpdate(id, { password: newPassword }, { new: true })
  }

  async kycSubmit(id: string, idProof: string, addressProof: string): Promise<IKyc | null> {
    await InstructorModel.findByIdAndUpdate(id, { KYCstatus: 'pending' }, { new: true })
    return await KycModel.create({ instructorId: id, idProof: idProof, addressProof: addressProof })
  }


  async getNotifications(id: string): Promise<INotification[] | null> {
    return await NotificationModel.find({ recipientId: id })
  }

  async changePassword(id: string, password: string): Promise<IInstructor | null> {
    return await InstructorModel.findByIdAndUpdate(id, { password: password })
  }


  async addCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return await CourseModel.create({ instructorId: id, ...data, });
  }

  


  async getCourses(id: string, search : string , skip: number, limit: number): Promise<ICourse[]> {
    const filter: any = { instructorId: id };

  if (search && search.trim() !== "") {
    filter.title = { $regex: search, $options: "i" };
  }
    const courses = await CourseModel.find(filter).skip(skip).limit(limit);
    return courses || [];
  }

  async getCourseDetails(courseId: string): Promise<ICourse | null> {
    const course = await CourseModel.findById(courseId)
    return course
  }



  async purchaseDetails(courseId: string): Promise<IPurchaseDetails[] | null> {
    const course = await CourseModel.findById(courseId).lean();
    if (!course) return null;

    // get all purchases for this course
    const purchases = await MyCourseModel.find({ courseId }).lean();
    if (!purchases || purchases.length === 0) return null;

    // fetch all userIds in one go
    const userIds = purchases.map(p => p.userId);
    const users = await UserModel.find({ _id: { $in: userIds } }).lean();

    // build a map for quick lookup
    const userMap = new Map(users.map(u => [String(u._id), u]));

    // map purchases to details
    const result: IPurchaseDetails[] = purchases.map(purchase => {
      const user = userMap.get(String(purchase.userId));
      if (!user) return

      return {
        name: user.name,
        title: course.title,
        ...(course.thumbnail && { thumbnail: course.thumbnail }),
        ...(course.price !== undefined && { price: course.price }),
        category: course.category,
        amountPaid: course.price ?? 0,
        paymentStatus: purchase.paymentStatus,
        createdAt: purchase.createdAt,
      };
    }).filter(Boolean) as IPurchaseDetails[];

    return result;
  }





  async editCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return await CourseModel.findByIdAndUpdate(id, data, { new: true });
  }



  async countCourses(id : string): Promise<number> {
    return await CourseModel.countDocuments({instructorId : id});

  }

  async findSkills(): Promise<ISkills> {
    const result = await CourseModel.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: null, uniqueSkills: { $addToSet: "$skills" } } },
      { $project: { _id: 0, uniqueSkills: 1 } }
    ])

    return result[0]
  }

  async addEvent(id: string, name: string, data: Partial<IEvent>): Promise<IEvent> {
    return await EventModel.create({ instructorId: id, instructorName: name, ...data })
  }


  async getMyEvents(id: string, search: string, page: string): Promise<IEventResult | null> {
    const limit = 3;
    const skip = (parseInt(page) - 1) * limit;
    // console.log(search);

    const query: any = { instructorId: id };

    if (search && search.trim() !== "") {
      query.title = { $regex: search, $options: "i" };
    }

    const events = await EventModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // console.log(events);


    const total = await EventModel.countDocuments(query);

    return {
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    };
  }




  async getEvent(id: string): Promise<IEvent | null> {
    return EventModel.findById(id)
  }


  async updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent | null> {
    return await EventModel.findByIdAndUpdate(id, { ...data },{new:true})
  }


  async addQuiz(courseId: string, title: string, questions: any[]): Promise<IQuiz> {
    return await QuizModel.create({ courseId, title, questions })
  }

  async getQuiz(courseId: string): Promise<IQuiz | null> {


    const quiz = await QuizModel.findById({ courseId: courseId })
    console.log(quiz);
    return quiz

  }

  async getQuizByCourseId(courseId: string): Promise<IQuiz | null> {
    return await QuizModel.findOne({ courseId })
  }


  async editQuiz(id: string, data: Partial<IQuiz>): Promise<IQuiz> {
    console.log(data);

    const updatedQuiz = await QuizModel.findOneAndUpdate(
  {courseId : id},
  {
    $set: {
      title: data.title,
      questions: data.questions,
    },
  },
  {
    new: true,
    runValidators: true,
  }
);

    console.log('updated ', updatedQuiz);


    if (!updatedQuiz) {
      throw new Error("Quiz not found");
    }

    return updatedQuiz;
  }



  startEventById = async (id: string): Promise<IEvent | null> => {
    if (!Types.ObjectId.isValid(id)) return null;

    return EventModel.findByIdAndUpdate(
      id,
      { isLive: true },
      { new: true }
    ).exec();
  };

  endEventById = async (id: string): Promise<IEvent | null> => {
    if (!Types.ObjectId.isValid(id)) return null;

    return EventModel.findByIdAndUpdate(
      id,
      {
        isLive: false,
        participantsList: [],
        participants: 0,
      },
      { new: true }
    ).exec();
  };

  //dashboard 
  totalCourses = async (id: string): Promise<number | null> => {
    try {
      const total = await CourseModel.countDocuments({ instructorId: id })
      return total
    } catch (error) {
      console.log(error);
      return null
    }
  }

  // interface IDashboardCourse{
  //     id : st
  // }

  // getMyCourses = async (id : string):Promise<string[] | null> =>{
  //     try {
  //         const courses = await CourseModel.countDocuments({instructorId:id}).select('_id')
  //         return courses
  //     } catch (error) {
  //         console.log(error);
  //         return null
  //     }
  // }




  getDashboard = async (instructorId: string): Promise<any> => {
    try {
      // 1️⃣ Total Courses
      const totalCourses = await CourseModel.countDocuments({ instructorId });

      // 2️⃣ Get course IDs created by this instructor
      const courses = await CourseModel.find({ instructorId }).select("_id title");
      const courseIds = courses.map((c) => c._id.toString());

      if (courseIds.length === 0) {
        return {
          totalCourses: 0,
          totalStudents: 0,
          totalEarnings: 0,
          monthlyEarnings: {},
          recentStudents: [],
        };
      }

      // 3️⃣ Get all enrollments for those courses
      const enrollments = await MyCourseModel.find({
        courseId: { $in: courseIds },
        cancelCourse: true,
      }).select("userId amountPaid paymentStatus createdAt courseId");

      // 4️⃣ Unique student count
      const uniqueStudents = new Set(enrollments.map((e) => e.userId));
      const totalStudents = uniqueStudents.size;

      // 5️⃣ Total Earnings
      const totalEarnings = enrollments
        .filter((e) => e.paymentStatus === "completed")
        .reduce((sum, e) => sum + (e.amountPaid || 0), 0);

      // 6️⃣ Monthly Earnings for charts
      const monthlyEarnings: Record<string, number> = {};
      enrollments.forEach((e) => {
        const month = e.createdAt.toLocaleString("default", { month: "short" });
        if (!monthlyEarnings[month]) monthlyEarnings[month] = 0;
        if (e.paymentStatus === "completed") {
          monthlyEarnings[month] += e.amountPaid || 0;
        }
      });


      // 7️⃣ Get recent students manually (limit 5)
      const recentEnrollments = enrollments
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

      // Get unique userIds & courseIds from these
      const userIds = [...new Set(recentEnrollments.map((e) => e.userId))];
      const courseIdSet = new Set(recentEnrollments.map((e) => e.courseId));

      // Fetch user and course data manually (no populate)
      const [users, recentCourses] = await Promise.all([
        UserModel.find({ _id: { $in: userIds } }).select("name email"),
        CourseModel.find({ _id: { $in: Array.from(courseIdSet) } }).select("_id title"),
      ]);

      const userMap = new Map(users.map((u) => [u._id.toString(), u]));
      const courseMap = new Map(recentCourses.map((c) => [c._id.toString(), c.title]));

      const recentStudents = recentEnrollments.map((e) => ({
        name: userMap.get(e.userId)?.name || "Unknown",
        email: userMap.get(e.userId)?.email || "",
        course: courseMap.get(e.courseId) || "Deleted Course",
        date: e.createdAt,
      }));

      // ✅ Final Response
      return {
        totalCourses,
        totalStudents,
        totalEarnings,
        monthlyEarnings,
        recentStudents,
      };
    } catch (error) {
      console.error("Error in getDashboard:", error);
      throw new Error("Failed to fetch instructor dashboard data");
    }
  };


  getMonthlyEarnings = async (instructorId: string): Promise<
    { month: string; earnings: number }[]
  > => {
    try {
      const result = await EarningModel.aggregate([
        { $match: { instructorId } },
        {
          $group: {
            _id: { $month: "$lastUpdated" },
            totalEarnings: { $sum: "$instructorEarnings" },
          },
        },
        { $sort: { "_id": 1 } },
      ]);

      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      // Map all 12 months to ensure consistent data
      const monthlyData = months.map((m, i) => {
        const found = result.find((r) => r._id === i + 1);
        return { month: m, earnings: found ? found.totalEarnings : 0 };
      });

      return monthlyData;
    } catch (error) {
      console.error("Error fetching monthly earnings:", error);
      return [];
    }
  };

  totalEarnings = async (id: string): Promise<number | null> => {
    try {
      // Fetch all earning records for this instructor
      const earnings = await EarningModel.find({ instructorId: id });

      // Calculate total instructor earnings
      const total = earnings.reduce((sum, e) => sum + (e.instructorEarnings || 0), 0);

      return total;
    } catch (error) {
      console.error("Error calculating total earnings:", error);
      return 0;
    }
  }


  getWallet = async (id: string): Promise<IWallet | null> => {
    try {
      const wallet = await WalletModel.findOne({ userId: id })

      return wallet
    } catch (error) {
      console.error("Error calculating total earnings:", error);
      return null;
    }
  }


// async addToWallet(id: string, transaction: WalletTransaction): Promise<void> {
//     const wallet = await WalletModel.findOne({ instructorId:id });

//     if (wallet) {
//       wallet.transactions.push({ ...transaction, createdAt: new Date() });
//       if (transaction.type === "credit") wallet.balance += transaction.amount;
//       else wallet.balance -= transaction.amount;
//       await wallet.save();
//     } else {
//       await WalletModel.create({
//         instructorId : id,
//         balance: transaction.type === "credit" ? transaction.amount : -transaction.amount,
//         transactions: [{ ...transaction, createdAt: new Date() }],
//       });
//     }
//   }


getCategory = async():Promise<ICategory[] | null>=>{
  try {
    return await CategoryModel.find()
  } catch (error) {
    console.log(error);
    return null
  }
}



}


