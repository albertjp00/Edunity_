import { CourseModel, ICourse } from '../models/course.js';
import { EventModel, IEvent } from '../models/events.js';
import { IMyCourse, MyCourseModel } from '../models/myCourses.js';
import { IMyEvent, MyEventModel } from '../models/myEvents.js';
import { IUser, UserModel } from '../models/user.js';
import { ISkills } from './instructorRepository.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(user: Partial<IUser>): Promise<IUser>;

  findById(id: string): Promise<IUser | null>;

  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;

  changePassword(id: string, password: string): Promise<IUser | null>;

  getCourse(id: string): Promise<ICourse | null>

  getCourses(skip: number, limit: number): Promise<ICourse[] | null>

  countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;

  getAllCourses(query: any, skip: number, limit: number): Promise<ICourse[] | null>

  getCourseDetails(id: string, courseId: string): Promise<IMyCourse | null>

  addMyCourse(id: string, data: any): Promise<IMyCourse | null>

  findMyCourses(id: string): Promise<IMyCourse[] | null>

  viewMyCourse(id: string, courseId: string): Promise<IMyCourse | null>

  updateProgress(userId: string, courseId: string, moduleTitle: string): Promise<IMyCourse | null>

  getMyEvent(id: string): Promise<IMyEvent | null>

  getEvents(): Promise<IEvent[] | null>


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

  // userRepository.ts

  async getCourses(skip: number, limit: number) {
    return CourseModel.aggregate([
      { $skip: skip },
      { $limit: 3 },
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

  async getAllCourses(query: any, skip: number, limit: number): Promise<ICourse[]> {
    return await CourseModel.aggregate([
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          instructorIdObj: { $toObjectId: "$instructorId" },
          moduleCount: { $size: { $ifNull: ["$modules", []] } }
        }
      }
      ,
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
          moduleCount:1
        },
      },
    ]);



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

}

