import { FilterQuery, Types } from "mongoose";
import { CourseModel, ICourse } from "../models/course";
import { EventModel, IEvent } from "../models/events";
import { FavouritesModel, IFavourite } from "../models/favourites";
import { IMyCourse, MyCourseModel } from "../models/myCourses";
import { IMyEvent, MyEventModel } from "../models/myEvents";
import { ISubscription, IUser, UserModel } from "../models/user";
import { ISkills } from "./instructorRepository";
import { IQuiz, QuizModel } from "../models/quiz";
import { IInstructor, InstructorModel } from "../models/instructor";
import { BaseRepository } from "./baseRepository";

import {
  IMyCourses,
  IPaymentDetails,
  ISubscriptionCourses,
  IUserRepository,
  SortOption,
  WalletTransaction,
} from "../interfaces/userInterfaces";
import { IWallet, WalletModel } from "../models/wallet";
import { IPayment, PaymentModel } from "../models/payment";
import { INotification, NotificationModel } from "../models/notification";
import { IReview, ReviewModel } from "../models/review";
import { IReport, ReportModel } from "../models/report";
import { INotifications } from "../interfacesServices.ts/userServiceInterfaces";
import { query } from "winston";
import { ISubscriptionPlan, SubscriptionModel } from "../models/subscription";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = new this.model(user);

    return await newUser.save();
  }

  async googleLogIn(user: Partial<IUser>): Promise<IUser> {
    const newUser = new this.model(user);
    return await newUser.save();
  }

  async isBlocked(id: string): Promise<boolean> {
    const blocked = await this.model.findById(id);
    if (blocked?.blocked) {
      return true;
    }
    console.log(blocked);

    return false;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.model.findById(id);
  }

  async updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async changePassword(id: string, password: string): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id, { password: password });
  }

  async getWallet(userId: string): Promise<IWallet | null> {
    return await WalletModel.findOne({ userId: userId });
  }

  async walletPayment(
  userId: string,
  balance: number,
  course: ICourse
): Promise<IWallet | null> {

  return await WalletModel.findOneAndUpdate(
    { userId },
    {
      $set: {
        balance: balance
      },
      $push: {
        transactions: {
          type: "debit",
          amount: course.price,
          courseId: course._id,
          description: `Payment for course ${course.title}`,
          createdAt: new Date()
        }
      }
    },
    { new: true }
  );
}

  async getPayment(
    userId: string,
    page: number,
  ): Promise<IPaymentDetails | null> {
    const limit = 6;
    const skip = (page - 1) * limit;

    const total = await PaymentModel.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const pay = await PaymentModel.find({ userId: userId })
      .skip(skip)
      .limit(limit);
    return { pay, total, totalPages, currentPage: page };
  }

  async getCourse(id: string): Promise<ICourse | null> {
    return await CourseModel.findById(id);
  }

  async onPurchase(id: string, value: boolean): Promise<ICourse | null> {
    return await CourseModel.findByIdAndUpdate(
      id,
      { onPurchase: value },
      { new: true },
    );
  }

  async cancelPurchase(id: string): Promise<ICourse | null> {
    return await CourseModel.findByIdAndUpdate(
      id,
      { onPurchase: false },
      { new: true },
    );
  }

  async buyCourse(id: string): Promise<ICourse | null> {
    return await CourseModel.findByIdAndUpdate(id, {
      $inc: { totalEnrolled: 1 },
    });
  }

  async updateSubscription(
    id: string,
    data: Partial<ISubscription>,
  ): Promise<boolean> {
    await UserModel.findByIdAndUpdate(
      id,
      { subscription: data },
      { new: true },
    );
    
    return true;
  }

  async getCourses(skip: number, limit: number) {
    return CourseModel.aggregate([
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          instructorIdObj: { $toObjectId: "$instructorId" },
        },
      },
      {
        $lookup: {
          from: "instructors",
          localField: "instructorIdObj",
          foreignField: "_id",
          as: "instructor",
        },
      },
      { $unwind: "$instructor" },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          price: 1,
          skills: 1,
          level: 1,
          totalEnrolled: 1,
          category: 1,
          createdAt: 1,
          instructorName: "$instructor.name",
          instructorImage: "$instructor.profileImage",
        },
      },
    ]);
  }

  async countCourses(): Promise<number> {
    return await CourseModel.countDocuments();
  }

  async findSkills(): Promise<ISkills> {
    const result = await CourseModel.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: null, uniqueSkills: { $addToSet: "$skills" } } },
      { $project: { _id: 0, uniqueSkills: 1 } },
    ]);

    return result[0];
  }

  async getAllCourses(
    query: FilterQuery<ICourse>,
    skip: number,
    limit: number,
    sortOption: SortOption,
  ) {
    const pipeline: any[] = [{ $match: query }];

    if (
      sortOption &&
      typeof sortOption === "object" &&
      Object.keys(sortOption).length > 0
    ) {
      pipeline.push({ $sort: sortOption });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          instructorIdObj: { $toObjectId: "$instructorId" },
          moduleCount: { $size: { $ifNull: ["$modules", []] } },
        },
      },
      {
        $lookup: {
          from: "instructors",
          localField: "instructorIdObj",
          foreignField: "_id",
          as: "instructor",
        },
      },
      { $unwind: "$instructor" },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          price: 1,
          skills: 1,
          level: 1,
          totalEnrolled: 1,
          category: 1,
          createdAt: 1,
          instructorName: "$instructor.name",
          instructorImage: "$instructor.profileImage",
          moduleCount: 1,
          blocked: 1,
        },
      },
    );

    return await CourseModel.aggregate(pipeline);
  }

  async countAllCourses(query: FilterQuery<ICourse>): Promise<number> {    
    return CourseModel.countDocuments(query);
  }

  async getCourseDetails(
    id: string,
    courseId: string,
  ): Promise<IMyCourse | null> {
    const course = await MyCourseModel.findOne({
      userId: String(id),
      courseId: courseId,
    });

    // console.log("Found course:", course);
    return course;
  }

  async findInstructors(): Promise<IInstructor[] | null> {
    return await InstructorModel.find().limit(4);
  }

  async instructorDetails(id:string): Promise<IInstructor | null> {
    return await InstructorModel.findById(id)
  }

  async addMyCourse(
    userId: string,
    courseData: Partial<ICourse>,
  ): Promise<IMyCourse | null> {
    try {

      const existingCourse = await MyCourseModel.findOne({
        userId,
        courseId: courseData._id,
      });

      if (existingCourse) {
        return existingCourse;
      }

      const newCourse = new MyCourseModel({
        userId,
        courseId: courseData._id,
        progress: { completedModules: [] },
      });

      return await newCourse.save();
    } catch (error) {
      console.error("Error in addMyCourse:", error);
      return null;
    }
  }

  async userPayment(
    userId: string,
    courseId: string,
    courseName: string,
    coursePrice: number,
  ): Promise<IPayment | null> {
    try {
      const payment = await PaymentModel.create({
        userId,
        courseId,
        amount: coursePrice,
        courseName,
      });
      console.log("added to payment");

      return payment;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async sendNotification(
    userId: string,
    title: string,
    message: string,
  ): Promise<INotification | null> {
    try {
      return await NotificationModel.create({
        recipientId: userId,
        title,
        message,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getNotifications(
    userId: string,
    page: number,
  ): Promise<INotifications | null> {
    try {
      const total = await NotificationModel.countDocuments({
        recipientId: userId,
      });
      const limit = 5;
      const skip = (page - 1) * limit;
      const notifications = await NotificationModel.find({
        recipientId: userId,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return { notifications, total };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async notificationsMarkRead(userId: string): Promise<INotification[] | null> {
    try {
      await NotificationModel.updateMany(
        { recipientId: userId, isRead: false },
        { $set: { isRead: true } },
      );

      const updated = await NotificationModel.find({
        recipientId: userId,
      }).sort({ createdAt: -1 });
      return updated;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findMyCourses(id: string, page: number): Promise<IMyCourses> {
    const limit = 3;
    const count = await MyCourseModel.countDocuments({
      userId: id,
      blocked: false,
    });
    const totalPages = Math.ceil(count / limit);

    const skip = (page - 1) * limit;
    const myCourses = await MyCourseModel.find({ userId: id, blocked: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      myCourses,
      totalCount: count,
      totalPages: totalPages,
      currentPage: page,
    };
  }

  async viewMyCourse(
    id: string,
    myCourseId: string,
  ): Promise<IMyCourse | null> {
    const data = await MyCourseModel.findOne({
      courseId: myCourseId,
      userId: id,
    });
    if (!data) return null;

    if (data.cancelCourse) {
      const date = new Date();
      const diffTime = date.getTime() - data?.createdAt.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays > 7) {
        data.cancelCourse = false;
        await data.save();
      }
    }

    return data;
  }

  async updateProgress(
    userId: string,
    courseId: string,
    moduleTitle: string,
  ): Promise<boolean | null> {
    try {
      const course = await MyCourseModel.findOne({ userId, courseId });

      if (!course) return null;

      const alreadyCompleted =
        course.progress?.completedModules?.includes(moduleTitle);

      if (!alreadyCompleted) {
        course.progress.completedModules.push(moduleTitle);
        course.cancelCourse = false;
        await course.save();
      }
      console.log("update progress ", course);

      return true;
    } catch (error) {
      console.error("Update progress error:", error);
      return null;
    }
  }

  async getCertificate(
    userId: string,
    courseId: string,
    certificate: string,
  ): Promise<IMyCourse | null> {
    try {
      console.log(courseId, userId, certificate);

      const path = await MyCourseModel.findOneAndUpdate(
        { userId, courseId },
        { certificate: certificate },
        { new: true },
      );
      console.log(path);
      return path;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addReview(
    userId: string,
    userName: string,
    userImage: string,
    courseId: string,
    rating: number,
    comment: string,
  ): Promise<IReview> {
    try {
      const review = await ReviewModel.findOneAndUpdate(
        { userId, courseId },
        {
          $set: { rating, comment },
          $setOnInsert: { userId, courseId, userName, userImage },
        },
        { new: true, upsert: true },
      );

      return review;
    } catch (error) {
      console.error("Error adding review:", error);
      throw new Error("Unable to add review");
    }
  }

  async getReview(userId: string, courseId: string): Promise<IReview[] | null> {
    try {
      return await ReviewModel.find({ courseId });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getEvents(search : string , page : number): Promise<{events : IEvent[] , totalPages:number} | null> {

    const limit = 4
    const skip = Math.ceil(page -1 )*limit
    console.log('serarch event ',search);
    
    
  const query: FilterQuery<IEvent> = {};

    if(search){
      query.$or = [
        {title : {$regex : search , $options : 'i'}},
        {description : {$regex : search , $options : 'i'}}
      ]
    }

    const totalPages = Math.ceil(await EventModel.countDocuments()/limit)

    const events =  await EventModel.find(query).skip(skip).limit(limit).sort({created : -1});

    return {events , totalPages}
  }

  async getMyEvent(id: string): Promise<IMyEvent | null> {
    return await MyEventModel.findOne({ eventId: id });
  }

  async enrollEvent(userId: string, eventId: string): Promise<IMyEvent> {
    await EventModel.findByIdAndUpdate(
      eventId,
      { $inc: { participants: 1 }, $push: { participantsList: userId } },
      { new: true },
    );

    const myEvent = await MyEventModel.create({
      userId,
      eventId,
      enrolledAt: new Date(),
      status: "enrolled",
    });

    return myEvent;
  }

  async getMyEvents(id: string): Promise<IEvent[] | null> {
    return await MyEventModel.find({ userId: id });
  }

  async addtoFavourites(
    userId: string,
    courseId: string,
  ): Promise<string | null> {
    const existing = await FavouritesModel.findOne({ userId, courseId });
    if (existing) {
      await FavouritesModel.deleteOne({ userId, courseId });
      return "removed";
    }
    await FavouritesModel.create({ userId, courseId });
    return "added";
  }

  async getFavourites(userId: string): Promise<IFavourite[] | null> {
    return await FavouritesModel.find({ userId: userId });
  }

  async getFavCourseDetails(
    userId: string,
    courseId: string,
  ): Promise<IFavourite | null> {
    return await FavouritesModel.findOne({
      userId: userId,
      courseId: courseId,
    });
  }

  async getQuiz(courseId: string): Promise<IQuiz | null> {
    return await QuizModel.findOne({ courseId: courseId });
  }

  async submitQuiz(userId: string, courseId: string, score: number):Promise<IMyCourse> {
    return await MyCourseModel.findOneAndUpdate(
      { userId, courseId },
      { $set: { quizScore: score } },
      { upsert: true, new: true },
    );
  }

  addParticipant = async (
    eventId: string,
    userId: string,
  ): Promise<IEvent | null> => {
    if (!Types.ObjectId.isValid(eventId)) return null;

    return EventModel.findByIdAndUpdate(
      eventId,
      {
        $addToSet: { participantsList: userId }, // avoid duplicates
        $inc: { participants: 1 },
      },
      { new: true },
    ).exec();
  };

  async findUserCourse(userId: string, courseId: string):Promise<IMyCourse | null> {
    return await MyCourseModel.findOne({ userId, courseId });
  }

  async removeUserCourse(userId: string, courseId: string):Promise<boolean> {
    await MyCourseModel.deleteOne({ userId, courseId });
    return true
  }

  async decreaseCourseEnrollment(courseId: string):Promise<boolean> {
    await CourseModel.updateOne(
      { _id: courseId },
      { $inc: { totalEnrolled: -1 } },
    );
    return true
  }

  async addTransaction(
    userId: string,
    transaction: WalletTransaction,
  ): Promise<void> {
    const wallet = await WalletModel.findOne({ userId });

    if (wallet) {
      wallet.transactions.push({ ...transaction, createdAt: new Date() });
      if (transaction.type === "credit") wallet.balance += transaction.amount;
      else wallet.balance -= transaction.amount;
      await wallet.save();
    } else {
      await WalletModel.create({
        userId,
        balance:
          transaction.type === "credit"
            ? transaction.amount
            : -transaction.amount,
        transactions: [{ ...transaction, createdAt: new Date() }],
      });
    }
  }

  async getSubscriptionActive(id: string): Promise<ISubscription | boolean> {
    const user = await UserModel.findById(id);

    if (!user || !user.subscription) return false;

    if (!user.subscription.isActive) return false;

    const { endDate } = user.subscription;

    if (endDate < new Date()) {
      user.subscription.isActive = false;
      await user.save();
      return false;
    }
    return user.subscription;
  }

  async getSubscriptionPlans(): Promise<ISubscriptionPlan[] | null>{
    try {
      const plan = await SubscriptionModel.find();
    return plan;
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getSubscriptionPlan(id:string): Promise<ISubscriptionPlan | null>{
    try {
      const plan = await SubscriptionModel.findById(id);
    return plan;
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getSubscriptionCourses(
    id: string,
    page: number,
  ): Promise<ISubscriptionCourses | null> {
    try {
      const limit = 3;
      const skip = (page - 1) * limit;

      const courses = await CourseModel.find({ accessType: "subscription" })
        .skip(skip)
        .limit(limit);

      const total = await CourseModel.countDocuments({
        accessType: "subscription",
      });

      return {
        totalPages: Math.ceil(total / limit),
        courses,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async reportCourse(
    userId: string,
    courseId: string,
    report: IReport,
  ): Promise<boolean | null> {
    try {
      const reportData: any = {
        userId,
        courseId,
        reason: report.reason,
      };
      if (report.message) {
        reportData.message = report.message;
      }
      await ReportModel.create(reportData);
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
