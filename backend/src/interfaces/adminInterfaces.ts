import { IInstructor } from "../models/instructor";
import { IUser } from "../models/user";


export interface PaginatedUsers {
  users: IUser[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}



export interface PaginatedInstructors {
  instructors: IInstructor[];
  totalPages: number;
  currentPage: number;
  totalInstructors: number;
}


export interface PurchaseResult {
  purchases: any[];
  totalPurchases: number;
  totalPages: number;
  currentPage: number;
}


export interface ICount {
  count : number
}

export interface IUserOverview {
  name: string;  // "Oct 2025"
  count: number;
}

