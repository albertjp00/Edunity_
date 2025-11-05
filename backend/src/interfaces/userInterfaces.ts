import { ICourse, IReview } from "../models/course.js";
import { IEvent } from "../models/events.js";
import { IFavourite } from "../models/favourites.js";
import { IInstructor } from "../models/instructor.js";
import { IMessage } from "../models/message.js";
import { IMyCourse } from "../models/myCourses.js";
import { IMyEvent } from "../models/myEvents.js";
import { IUser } from "../models/user.js";
import { IWallet } from "../models/wallet.js";
import { ISkills } from "../repositories/instructorRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(user: Partial<IUser>): Promise<IUser>;

  findById(id: string): Promise<IUser | null>;

  isBlocked(id: string):Promise<boolean>

  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;

  changePassword(id: string, password: string): Promise<IUser | null>;

  getWallet(userId: string):Promise<IWallet | null>

  getCourse(id: string): Promise<ICourse | null>

  buyCourse(id: string): Promise<ICourse | null>

  getCourses(skip: number, limit: number): Promise<ICourse[] | null>

  countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;

  getAllCourses(query: any, skip: number, limit: number, sortOption: any): Promise<ICourse[] | null>

  getCourseDetails(id: string, courseId: string): Promise<IMyCourse | null>

  findInstructors():Promise<IInstructor[] | null>

  addMyCourse(id: string, data: any): Promise<IMyCourse | null>

  findMyCourses(id: string , page : number): Promise<IMyCourses | null>

  viewMyCourse(id: string, courseId: string): Promise<IMyCourse | null>

  updateProgress(userId: string, courseId: string, moduleTitle: string): Promise<IMyCourse | null>

  getCertificate(userId: string , courseId : string , certificate : string) : Promise<IMyCourse>

  addReview(userId: string,userName : string , userImage : string , courseId: string, rating: number, comment: string): Promise<IReview>

  getMyEvent(id: string): Promise<IMyEvent | null>

  getEvents(): Promise<IEvent[] | null>

  getMyEvents(id:string):Promise<IEvent[] | null>

  addtoFavourites(id: string, courseId: string): Promise<IFavourite | null>

  getFavourites(userId: string): Promise<IFavourite[] | null>

  addParticipant(eventId: string,userId: string): Promise<IEvent | null>

}





export interface IMessagedUser {
    instructor : IUser;
    lastMessage : IMessage
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


export interface IMyCourses {
  myCourses : IMyCourse[];
      totalCount : number;
      totalPages : number;
      currentPage : number; 
      
}


export interface WalletTransaction {
  type: "credit" | "debit";
  amount: number;
  courseId?: string;
  description?: string;
}