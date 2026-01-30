import { Types } from "mongoose";
import {
  AdminCourseDetailsDTO,
  AdminLoginDTO,
  AdminStatsDTO,
  CategoryDTO,
  CourseDTO,
  CourseListAggregation,
  DTOKyc,
  EarningsDTO,
  InstructorAdminDTO,
  PurchaseAdminDTO,
  PurchasePDFRow,
  ReportDTO,
  StatsDTO,
  TotalEnrolledDTO,
  UserOverviewDTO,
} from "../dto/adminDTO";
import { AdminUserCourseDTO, UserDTO } from "../interfaces/userInterfaces";
import { ITotalEnrolled } from "../interfacesServices.ts/adminServiceInterfaces";
import { ICourse } from "../models/course";
import { IEarnings } from "../models/earnings";
import { IInstructor } from "../models/instructor";
import { IKyc } from "../models/kyc";
import { IUser } from "../models/user";
import {
  AdminCourseDetailsRaw,
  IPurchase,
  PurchaseResult,
} from "../interfaces/adminInterfaces";
import { ICategory } from "../models/category";
import { IReport } from "../models/report";
import { LoginDTO } from "../dto/userDTO";
import { StatusMessage } from "../enums/statusMessage";

export const mapCourseToDTO = (course: CourseListAggregation): CourseDTO => ({
  id: course._id.toString(),
  title: course.title,
  thumbnail: course.thumbnail ?? "",
  price: course.price ?? 0,
  instructorName: course.instructorName ?? "Unknown",
  createdAt: course.createdAt ?? new Date(),
  category: course.category,
  blocked: course.blocked,
});



export const mapPurchaseToDTO = (purchase: any): PurchaseAdminDTO => {
  return {
    userId: purchase.userId,
    userName: purchase.userName,
    userEmail: purchase.userEmail,
    courseId: purchase.courseId,
    courseTitle: purchase.courseTitle,
    coursePrice: purchase.coursePrice,
    amountPaid: purchase.amountPaid,
    paymentStatus: purchase.paymentStatus,
    createdAt: purchase.createdAt.toISOString(),
  };
};



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
  totalEnrolled: stats.totalEnrolled ?? [],
});

export const mapUserOverviewToDTO = (
  data: { name: string; count: number }[],
): UserOverviewDTO[] => {
  return data.map((item) => ({
    name: item.name,
    count: item.count,
  }));
};

export const mapEarningsToDTO = (data: IEarnings[]): EarningsDTO[] => {
  return data.map((item) => ({
    adminEarnings: Number(item.adminEarnings) || 0,
    instructorEarnings: Number(item.instructorEarnings) || 0,
    totalSales: Number(item.totalSales) || 0,
    lastUpdated: new Date(item.lastUpdated).toISOString(),
  }));
};

export const mapInstructorToAdminDTO = (
  instructor: IInstructor,
): InstructorAdminDTO => {
  return {
    id: instructor._id,
    name: instructor.name,
    email: instructor.email,
    profileImage: instructor.profileImage || "",
    KYCstatus: instructor.KYCstatus,
    blocked: instructor.blocked,
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
    createdAt: user.createdAt,
  };
};

export const mapAdminUserCourseToDTO = (
  course: ICourse,
): AdminUserCourseDTO => {
  return {
    id: course._id.toString(),
    title: course.title,
    thumbnail: course.thumbnail || "",
  };
};

export const mapAdminCourseDetailsToDTO = (
  details: AdminCourseDetailsRaw,
): AdminCourseDetailsDTO => {
  const { course, instructor, enrolledUsers, totalEnrolled } = details;

  const instructorDTO: AdminCourseDetailsDTO["instructor"] = {
    id: instructor._id.toString(),
    name: instructor.name,
    email: instructor.email,
    expertise: instructor.expertise,
    profileImage: instructor.profileImage,
    skills: instructor.skills,
    blocked: instructor.blocked,
    KYCstatus: instructor.KYCstatus,
    ...(instructor.bio !== undefined && { bio: instructor.bio }),
    ...(instructor.education !== undefined && {
      education: instructor.education,
    }),
    ...(instructor.work !== undefined && { work: instructor.work }),
  };

  return {
    course: {
      id: course._id.toString(),
      title: course.title,
      description: course.description,
      price: course.price,
      skills: course.skills,
      level: course.level,
      category: course.category,
      thumbnail: course.thumbnail,
      blocked: course.blocked,
      accessType: course.accessType,
      createdAt: course.createdAt,
      totalEnrolled: totalEnrolled,
    },
    instructor: instructorDTO,
    enrolledUsersCount: enrolledUsers.length,
  };
};





export const mapPurchaseToPDFRow = (
  purchase: PurchaseAdminDTO
): PurchasePDFRow => {
  return {
    userName: purchase.userName,
    userEmail: purchase.userEmail,
    courseTitle: purchase.courseTitle,
    coursePrice: purchase.coursePrice,
    amountPaid: purchase.amountPaid,
    paymentStatus: purchase.paymentStatus,
    createdAt: purchase.createdAt,
  };
};

export const mapPurchasesToPDFRows = (
  purchases: PurchaseAdminDTO[]
): PurchasePDFRow[] => {
  return purchases.map(mapPurchaseToPDFRow);
};



export const mapCategoryDto = (category :ICategory ):CategoryDTO=>{
  return {
    id : category.id,
    name : category.name,
    skills : category.skills
  }
}

export const mapReportDto = (report :IReport ):ReportDTO=>{
  return {
    id:report.id,
    userId: report.userId,
    courseId: report.courseId,
    reason: report.reason,
    createdAt: report.createdAt,
  }
}



export const AdminLoginMapper =(token : string): AdminLoginDTO => {
    return {
      success : true,
      message:StatusMessage.LOGIN_SUCCESS,
      token,
    };
  }





export interface RawStats {
  totalUsers: number | null;
  totalInstructors: number | null;
  totalCourses: number | null;
  totalEnrolled: TotalEnrolledDTO[] | null;
}

export const AdminStatsMapper = (data: RawStats): AdminStatsDTO => {
  return {
    totalUsers: data.totalUsers ?? 0,
    totalInstructors: data.totalInstructors ?? 0,
    totalCourses: data.totalCourses ?? 0,
    totalEnrolled: data.totalEnrolled ?? [],
  };
};
