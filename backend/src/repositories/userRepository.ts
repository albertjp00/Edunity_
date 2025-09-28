import mongoose, { Types } from 'mongoose';
import { CourseModel, ICourse } from '../models/course.js';
import { EventModel, IEvent } from '../models/events.js';
import { FavouritesModel, IFavourite } from '../models/favourites.js';
import { IMyCourse, MyCourseModel } from '../models/myCourses.js';
import { IMyEvent, MyEventModel } from '../models/myEvents.js';
import { IUser, UserModel } from '../models/user.js';
import { ISkills } from './instructorRepository.js';
import { IQuiz, QuizModel } from '../models/quiz.js';
import { IInstructor, InstructorModel } from '../models/instructor.js';
import { IUserRepository } from '../interfaces/userInterfaces.js';





export class UserRepository implements IUserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async googleLogIn(user: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async isBlocked(id: string):Promise<boolean>{
    const blocked = await UserModel.findById(id)
    if(blocked?.blocked){
      return true
    }
    console.log(blocked);
    
    return false
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
    const course = await MyCourseModel.findOne({
      userId: String(id),
      courseId: courseId,
    })

    // console.log("Found course:", course);
    return course;
  }


  async findInstructors():Promise<IInstructor[] | null>{
    return await InstructorModel.find()
  }




  async addMyCourse(userId: string, courseData: any): Promise<IMyCourse | null> {
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

  async findMyCourses(id: string): Promise<IMyCourse[] | null> {
    return await MyCourseModel.find({ userId: id })
  }





  async viewMyCourse(id: string, myCourseId: string): Promise<IMyCourse | null> {
    const data = await MyCourseModel.findOne({
      _id: myCourseId,
      userId: id,
    });

    return data;
  }


  async updateProgress(userId: string, myCourseId: string, moduleTitle: string): Promise<IMyCourse | null> {
    console.log(userId, myCourseId);

    const myCourse = await MyCourseModel.findById(myCourseId)
    console.log(myCourse);

    const course = await MyCourseModel.findByIdAndUpdate(
      myCourseId,
      { $addToSet: { "progress.completedModules": moduleTitle } },
      { new: true }
    );
    console.log(course);


    return course;
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


}

