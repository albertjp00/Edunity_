import { CourseModel, ICourse } from '../models/course.js';
import { IUser, UserModel } from '../models/user.js';
import { ISkills } from './instructorRepository.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;
  changePassword(id: string, password: string): Promise<IUser | null>;

  getCourses(skip:number , limit:number): Promise<ICourse[] | null>
  countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;
}

export class UserRepository implements IUserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
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



  async getCourses(skip: number, limit: number): Promise<ICourse[]> {
        return await CourseModel.find()
            .skip(skip)
            .limit(limit)
            .exec();
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

}
