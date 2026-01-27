import { Types } from "mongoose";
import { CourseDTO, CourseListAggregation, DTOKyc, EarningsDTO, InstructorAdminDTO, PurchaseDTO, StatsDTO, UserOverviewDTO } from "../dto/adminDTO";
import { AdminUserCourseDTO, UserDTO } from "../interfaces/userInterfaces";
import { ITotalEnrolled } from "../interfacesServices.ts/adminServiceInterfaces";
import { ICourse } from "../models/course";
import { IEarnings } from "../models/earnings";
import { IInstructor } from "../models/instructor";
import { IKyc } from "../models/kyc";
import { IUser } from "../models/user";
import { IPurchase } from "../interfaces/adminInterfaces";

export const mapCourseToDTO = (course: CourseListAggregation): CourseDTO => ({
  id: course._id.toString(),
  title: course.title,
  thumbnail: course.thumbnail ?? '',
  price: course.price ?? 0,
  instructorName: course.instructorName ?? 'Unknown',
  createdAt: course.createdAt ?? new Date(),
  category: course.category,
  blocked : course.blocked
});



export const mapPurchaseToDTO = (purchase: IPurchase): PurchaseDTO => ({
  id: purchase._id,
  userName: purchase.userName,
  courseTitle: purchase.courseTitle,
  coursePrice: purchase.coursePrice,
  amountPaid: purchase.amountPaid,
  paymentStatus: purchase.paymentStatus,
  purchasedAt: purchase.createdAt,
});





export const mapStatsToDTO = (stats: {
        totalUsers: number | null;
        totalInstructors: number | null;
        totalCourses: number | null;
         totalEarnings: number | null;
        totalEnrolled: ITotalEnrolled[] | null;
    }): StatsDTO => ({
  totalUsers: stats.totalUsers ?? 0,
  totalInstructors: stats.totalInstructors ?? 0,
  totalCourses: stats.totalCourses ?? 0,
  totalEarnings: stats.totalEarnings ?? 0,
  totalEnrolled : stats.totalEnrolled ?? []
});

export const mapUserOverviewToDTO = (data: {name : string , count : number}[]): UserOverviewDTO[] => {
  return data.map(item =>({
    name : item.name,
    count : item.count
  }))
};


export const mapEarningsToDTO = (data: IEarnings[]): EarningsDTO[] => {
  return data.map(item => ({
    adminEarnings: Number(item.adminEarnings) || 0,
    instructorEarnings: Number(item.instructorEarnings) || 0,
    totalSales: Number(item.totalSales) || 0,
    lastUpdated: new Date(item.lastUpdated).toISOString(),
  }));
};





export const mapInstructorToAdminDTO = (instructor: IInstructor): InstructorAdminDTO => {
  return {
    id: instructor._id,
    name: instructor.name,
    email: instructor.email,
    profileImage: instructor.profileImage || '',
    KYCstatus: instructor.KYCstatus,
    blocked : instructor.blocked
    // totalPages: 1,
    // currentPage: 1,
    // totalInstructors: 3
  };
};



export const mapKycToDTO = (data: IKyc): DTOKyc => ({
  id: (data._id as Types.ObjectId).toString(),
  instructorId: data.instructorId,
  idProof: data.idProof,
  addressProof: data.addressProof,
});





export const mapUserToDTO = (user: IUser): UserDTO => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        blocked: user.blocked,
        createdAt: user.createdAt
    };
};



export const mapAdminUserCourseToDTO = (course: ICourse): AdminUserCourseDTO => {
  return {
    id: course._id.toString(),
    title: course.title,
    thumbnail: course.thumbnail || ""
  };
};



