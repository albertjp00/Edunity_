import { CourseModel, ICourse } from '../models/course.js';
import { EventModel, IEvent } from '../models/events.js';
import { FavouritesModel, IFavourite } from '../models/favourites.js';
import { IMyCourse, MyCourseModel } from '../models/myCourses.js';
import { IMyEvent, MyEventModel } from '../models/myEvents.js';
import { IOrder, OrderModel } from '../models/orderModel.js';
import { IUser, UserModel } from '../models/user.js';
import { ISkills } from './instructorRepository.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(user: Partial<IUser>): Promise<IUser>;

  findById(id: string): Promise<IUser | null>;

  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;

  changePassword(id: string, password: string): Promise<IUser | null>;

  getCourse(id: string): Promise<ICourse | null>

  buyCourse(id: string): Promise<ICourse | null>

  getCourses(skip: number, limit: number): Promise<ICourse[] | null>

  countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;

  getAllCourses(query: any, skip: number, limit: number, sortOption: any): Promise<ICourse[] | null>

  getCourseDetails(id: string, courseId: string): Promise<IMyCourse | null>

  addMyCourse(id: string, data: any): Promise<IMyCourse | null>

  findMyCourses(id: string): Promise<IMyCourse[] | null>

  findMyCourseExist(userId : string , courseId : string):Promise<IMyCourse | null>

  createOrder(
  userId: string,
  courseId: string,
  razorpayOrder: any,
  amount: number,
  currency: string,
  status: string
) :Promise<IOrder | null>

  findExistingOrder(userId: string, courseId: string):Promise<IOrder | null>

  addMyCourse(id: string, data: any): Promise<IMyCourse | null>

  

  viewMyCourse(id: string, courseId: string): Promise<IMyCourse | null>

  updateProgress(userId: string, courseId: string, moduleTitle: string): Promise<IMyCourse | null>

  getMyEvent(id: string): Promise<IMyEvent | null>

  getEvents(): Promise<IEvent[] | null>

  addtoFavourites(id: string, courseId: string): Promise<IFavourite | null>


}

export class UserRepository implements IUserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async googleLogIn(user: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async changePassword(id: string, password: string): Promise<IUser | null> {

    return await UserModel.findByIdAndUpdate(id, { password: password })
  }

  async getCourse(id: string): Promise<ICourse | null> {
    return await CourseModel.findById(id)
  }

  async buyCourse(id: string): Promise<ICourse | null> {
    return await CourseModel.findByIdAndUpdate(id, { $inc: { totalEnrolled: 1 } })
  }

  // userRepository.ts

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

    // Add sort stage only if sortOption exists
    if (sortOption && Object.keys(sortOption).length > 0) {
      pipeline.push({ $sort: sortOption });
    }

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
    const course = await MyCourseModel.findOne({ userId: id, 'course.id': courseId })
    return course
  }



  async addMyCourse(userId: string, courseData: any): Promise<IMyCourse | null> {
    try {

      const existingCourse = await MyCourseModel.findOne({
        userId,
        "course.id": courseData._id,
      });

      if (existingCourse) {

        return existingCourse;
      }

      const newCourse = new MyCourseModel({
        userId,
        course: {
          id: courseData._id.toString(),
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          thumbnail: courseData.thumbnail,
          modules: courseData.modules,
        },
        progress: { completedModules: [] },
      });


      return await newCourse.save();
    } catch (error) {
      console.error("Error in addMyCourse:", error);
      return null;
    }
  }

  async findMyCourses(id: string): Promise<IMyCourse[] | null> {
    return await MyCourseModel.find({ userId: id })
  }

  async findMyCourseExist(userId : string , courseId : string ):Promise<IMyCourse | null>{
    return await MyCourseModel.findOne({userId : userId , courseId : courseId , status: { $in: ["pending", "paid"] }})
  }

async createOrder(
  userId: string,
  courseId: string,
  razorpayOrder: any,
  amount: number,
  currency: string,
  status: string
) {
  return await OrderModel.create({
    userId,
    courseId,
    orderId: razorpayOrder.id,
    amount,
    currency,
    status,
  });
}


  async findExistingOrder(userId: string, courseId: string) {
    return await OrderModel.findOne({ userId, courseId, status: { $in: ["pending", "paid"] } });
  }

  async viewMyCourse(id: string, myCourseId: string): Promise<IMyCourse | null> {
    const data = MyCourseModel.findById(myCourseId)
    return data

  }

  async updateProgress(userId: string, courseId: string, moduleTitle: string): Promise<IMyCourse | null> {
    return MyCourseModel.findOneAndUpdate(
      { userId, "course.id": courseId },
      { $addToSet: { "progress.completedModules": moduleTitle } },
      { new: true }
    );
  }


  async getEvents(): Promise<IEvent[] | null> {
    return await EventModel.find()
  }

  async getMyEvent(id: string): Promise<IMyEvent | null> {
    return await MyEventModel.findOne({ eventId: id })
  }

  async enrollEvent(id: string, eventId: string): Promise<IMyEvent | null> {
    await EventModel.findByIdAndUpdate(eventId, { $inc: { participants: 1 } }, { new: true })
    return await MyEventModel.create({ userId: id, eventId })
  }

  async addtoFavourites(userId: string, courseId: string): Promise<IFavourite | null> {
    const existing = await FavouritesModel.findOne({ userId, courseId });
    if (existing) {
      return null;
    }
    return await FavouritesModel.create({ userId, courseId });
  }


}

