import mongoose, { Types } from 'mongoose';
import { CourseModel, ICourse, IReview } from '../models/course';
import { EventModel, IEvent } from '../models/events';
import { FavouritesModel, IFavourite } from '../models/favourites';
import { IMyCourse, MyCourseModel } from '../models/myCourses';
import { IMyEvent, MyEventModel } from '../models/myEvents';
import { IUser, UserModel } from '../models/user';
import { ISkills } from './instructorRepository';
import { IQuiz, QuizModel } from '../models/quiz';
import { IInstructor, InstructorModel } from '../models/instructor';
import { BaseRepository } from './baseRepository';

import { IMyCourses, IUserRepository, WalletTransaction } from '../interfaces/userInterfaces';
import { IWallet, WalletModel } from '../models/wallet';
import { log } from 'winston';




export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository {

  constructor() {
    super(UserModel)
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
    const blocked = await this.model.findById(id)
    if (blocked?.blocked) {
      return true
    }
    console.log(blocked);

    return false
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

    return await this.model.findByIdAndUpdate(id, { password: password })
  }

  async getWallet(userId: string): Promise<IWallet | null> {
    return await WalletModel.findOne({ userId: userId })
  }

  async getCourse(id: string): Promise<ICourse | null> {

    return await CourseModel.findById(id)
  }

  async buyCourse(id: string): Promise<ICourse | null> {
    return await CourseModel.findByIdAndUpdate(id, { $inc: { totalEnrolled: 1 } })
  }






  async getCourses(skip: number, limit: number) {
    return CourseModel.aggregate([
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          instructorIdObj: { $toObjectId: "$instructorId" }
        }
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
      { $project: { _id: 0, uniqueSkills: 1 } }
    ])


    return result[0]
  }

  async getAllCourses(
    query: any,
    skip: number,
    limit: number,
    sortOption?: any
  ): Promise<ICourse[]> {
    const pipeline: any[] = [
      { $match: query },
    ];

    // ✅ Sort before pagination
    if (sortOption && Object.keys(sortOption).length > 0) {
      pipeline.push({ $sort: sortOption });
    }

    // ✅ Pagination after sorting
    pipeline.push(
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          instructorIdObj: { $toObjectId: "$instructorId" },
          moduleCount: { $size: { $ifNull: ["$modules", []] } }
        }
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
        },
      }
    );


    return await CourseModel.aggregate(pipeline);
  }




  async countAllCourses(query: any): Promise<number> {
    return CourseModel.countDocuments(query);
  }


  async getCourseDetails(id: string, courseId: string): Promise<IMyCourse | null> {
    const course = await MyCourseModel.findOne({
      userId: String(id),
      courseId: courseId,
    })

    // console.log("Found course:", course);
    return course;
  }


  async findInstructors(): Promise<IInstructor[] | null> {
    return await InstructorModel.find()
  }




  async addMyCourse(userId: string, courseData: Partial<ICourse>): Promise<IMyCourse | null> {
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

  async findMyCourses(id: string, page: number): Promise<IMyCourses> {

    const limit = 3
    const count = await MyCourseModel.countDocuments({ userId: id })
    const totalPages = Math.ceil(count / limit)

    const skip = (page - 1) * limit
    const myCourses = await MyCourseModel.find({ userId: id }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    return { myCourses, totalCount: count, totalPages: totalPages, currentPage: page }
  }





  async viewMyCourse(id: string, myCourseId: string): Promise<IMyCourse | null> {
    const data = await MyCourseModel.findOne({
      courseId: myCourseId,
      userId: id,
    });
    console.log(data);

    return data;
  }


  async updateProgress(userId: string, myCourseId: string, moduleTitle: string): Promise<IMyCourse | null> {
    console.log(userId, myCourseId);


    const myCourse = await MyCourseModel.findByIdAndUpdate(myCourseId, { cancelCourse: false })
    console.log('course update progress', myCourse);

    const course = await MyCourseModel.findByIdAndUpdate(
      myCourseId,
      { $addToSet: { "progress.completedModules": moduleTitle } },
      { new: true }
    );
    console.log(course);


    return course;
  }

  async addCertificate(userId: string, courseId: string, certificate: string): Promise<IMyCourse | null> {
    try {

      console.log(courseId, userId, certificate);

      const path = await MyCourseModel.findOneAndUpdate({ userId, courseId }, { certificate: certificate }, { new: true })
      console.log(path)
      return path
    } catch (error) {
      console.log(error);
      return null
    }
  }



  async addReview(userId: string,userName : string , userImage : string , courseId: string, rating: number, comment: string): Promise<IReview> {
    try {
      const course = await CourseModel.findById(courseId);

      if (!course) {
        throw new Error("Course not found");
      }

      // Check if user already reviewed
      const existingReview = course.review.find(
        (r) => r.userId.toString() === userId
      );
      if (existingReview) {
        throw new Error("User has already reviewed this course");
      }

      // Create new review
      const newReview: IReview = {
        userId,
        userName,
        userImage,
        rating,
        comment,
        createdAt: new Date(),
      };

      // Add review to course
      course.review.push(newReview);

      // Calculate new average rating
      const total = course.review.reduce((sum, r) => sum + r.rating, 0);
      course.averageRating = total / course.review.length;

      await course.save();

      return newReview;
    } catch (error) {
      console.error("Error adding review:", error);
      throw new Error("Unable to add review");
    }
  }



  async getEvents(): Promise<IEvent[] | null> {
    return await EventModel.find()
  }

  async getMyEvent(id: string): Promise<IMyEvent | null> {
    return await MyEventModel.findOne({ eventId: id })
  }


  async enrollEvent(userId: string, eventId: string): Promise<IMyEvent> {
    await EventModel.findByIdAndUpdate(
      eventId,
      { $inc: { participants: 1 }, $push: { participantsList: userId } },
      { new: true }
    );

    const myEvent = await MyEventModel.create({
      userId,
      eventId,
      enrolledAt: new Date(),
      status: "enrolled",
    });

    return myEvent;
  };


  async getMyEvents(id: string): Promise<IEvent[] | null> {
    console.log('userid - - - - -', id);

    return await MyEventModel.find({ userId: id })
  }

  async addtoFavourites(userId: string, courseId: string): Promise<IFavourite | null> {
    const existing = await FavouritesModel.findOne({ userId, courseId });
    if (existing) {
      return null;
    }
    return await FavouritesModel.create({ userId, courseId });
  }


  async getFavourites(userId: string): Promise<IFavourite[] | null> {
    return await FavouritesModel.find({ userId: userId })
  }

  async getFavCourseDetails(userId: string, courseId: string): Promise<IFavourite | null> {
    return await FavouritesModel.findOne({ userId: userId, courseId: courseId })
  }


  async getQuiz(courseId: string): Promise<IQuiz | null> {
    return await QuizModel.findOne({ courseId: courseId })
  }


  async submitQuiz(userId: string, courseId: string, score: number) {
    return await MyCourseModel.findOneAndUpdate(
      { userId, courseId },
      { $set: { quizScore: score } },
      { upsert: true, new: true }
    );
  }


  addParticipant = async (
    eventId: string,
    userId: string
  ): Promise<IEvent | null> => {
    if (!Types.ObjectId.isValid(eventId)) return null;

    return EventModel.findByIdAndUpdate(
      eventId,
      {
        $addToSet: { participantsList: userId }, // avoid duplicates
        $inc: { participants: 1 },
      },
      { new: true }
    ).exec();
  };


  ///get course is on top
  // async getCourse(courseId: string){
  //   return await CourseModel.findById(courseId)
  // }

  async findUserCourse(userId: string, courseId: string) {
    return await MyCourseModel.findOne({ userId, courseId });
  }

  async removeUserCourse(userId: string, courseId: string) {
    return await MyCourseModel.deleteOne({ userId, courseId });
  }

  async decreaseCourseEnrollment(courseId: string) {
    return await CourseModel.updateOne({ _id: courseId }, { $inc: { totalEnrolled: -1 } });
  }


  async addTransaction(userId: string, transaction: WalletTransaction): Promise<void> {
    const wallet = await WalletModel.findOne({ userId });

    if (wallet) {
      wallet.transactions.push({ ...transaction, createdAt: new Date() });
      if (transaction.type === "credit") wallet.balance += transaction.amount;
      else wallet.balance -= transaction.amount;
      await wallet.save();
    } else {
      await WalletModel.create({
        userId,
        balance: transaction.type === "credit" ? transaction.amount : -transaction.amount,
        transactions: [{ ...transaction, createdAt: new Date() }],
      });
    }
  }


}

