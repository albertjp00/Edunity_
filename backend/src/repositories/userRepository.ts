import { IUser, UserModel } from '../models/user.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser | null>;
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

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, data, { new: true });
  }
}
