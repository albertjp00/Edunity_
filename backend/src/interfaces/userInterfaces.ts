import { ICourse } from "../models/course.js";
import { IEvent } from "../models/events.js";
import { IFavourite } from "../models/favourites.js";
import { IInstructor } from "../models/instructor.js";
import { IMyCourse } from "../models/myCourses.js";
import { IMyEvent } from "../models/myEvents.js";
import { IUser } from "../models/user.js";
import { ISkills } from "../repositories/instructorRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(user: Partial<IUser>): Promise<IUser>;

  findById(id: string): Promise<IUser | null>;

  isBlocked(id: string):Promise<boolean>

  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;

  changePassword(id: string, password: string): Promise<IUser | null>;

  getCourse(id: string): Promise<ICourse | null>

  buyCourse(id: string): Promise<ICourse | null>

  getCourses(skip: number, limit: number): Promise<ICourse[] | null>

  countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;

  getAllCourses(query: any, skip: number, limit: number, sortOption: any): Promise<ICourse[] | null>

  getCourseDetails(id: string, courseId: string): Promise<IMyCourse | null>

  findInstructors():Promise<IInstructor[] | null>

  addMyCourse(id: string, data: any): Promise<IMyCourse | null>

  findMyCourses(id: string): Promise<IMyCourse[] | null>

  viewMyCourse(id: string, courseId: string): Promise<IMyCourse | null>

  updateProgress(userId: string, courseId: string, moduleTitle: string): Promise<IMyCourse | null>

  getMyEvent(id: string): Promise<IMyEvent | null>

  getEvents(): Promise<IEvent[] | null>

  getMyEvents(id:string):Promise<IEvent[] | null>

  addtoFavourites(id: string, courseId: string): Promise<IFavourite | null>

  getFavourites(userId: string): Promise<IFavourite[] | null>

  addParticipant(eventId: string,userId: string): Promise<IEvent | null>


}










export interface LoginResult {
  success: boolean;
  message: string;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
}


export interface googleLoginResult{
     accessToken: string;
     refreshToken : string ; 
     user: IUser;
}