import { CourseDetailsDTO, CourseDTO, EarningsDTO, InstructorAdminDTO, KycDTO, PurchaseDTO, StatsDTO, UserOverviewDTO } from "../dto/adminDTO";
import { AdminUserCourseDTO, UserDTO } from "../interfaces/userInterfaces";
import { ICourse } from "../models/course";
import { IEarnings } from "../models/earnings";
import { IUser } from "../models/user";

export const mapCourseToDTO = (course: any): CourseDTO => ({
  id: course._id,
  title: course.title,
  thumbnail: course.thumbnail,
  price: course.price,
  instructorName: course.instructorName,
  createdAt: course.createdAt,
  category: course.category,
  blocked : course.blocked
});

export const mapCourseDetailsToDTO = (data: any): CourseDetailsDTO => ({
  id: data.course._id,
  title: data.course.title,
  description: data.course.description,
  price: data.course.price,
  thumbnail: data.course.thumbnail,
  instructor: {
    id: data.instructor._id,
    name: data.instructor.name,
    email: data.instructor.email,
  },
  enrolledUsers: data.enrolledUsers,
});

export const mapPurchaseToDTO = (purchase: any): PurchaseDTO => ({
  id: purchase._id,
  userName: purchase.userName,
  courseTitle: purchase.courseTitle,
  coursePrice: purchase.coursePrice,
  amountPaid: purchase.amountPaid,
  paymentStatus: purchase.paymentStatus,
  purchasedAt: purchase.createdAt,
});





export const mapStatsToDTO = (stats: any): StatsDTO => ({
  totalUsers: stats.totalUsers ?? 0,
  totalInstructors: stats.totalInstructors ?? 0,
  totalCourses: stats.totalCourses ?? 0,
  totalEarnings: stats.totalEarnings ?? 0,
  totalEnrolled : stats.totalEnrolled ?? 0
});

export const mapUserOverviewToDTO = (data: {name : string , count : number}[]): UserOverviewDTO[] => {
  return data.map(item =>({
    name : item.name,
    count : item.count
  }))
};


export const mapEarningsToDTO = (data: any[]): EarningsDTO[] => {
  return data.map(item => ({
    adminEarnings: Number(item.adminEarnings) || 0,
    instructorEarnings: Number(item.instructorEarnings) || 0,
    totalSales: Number(item.totalSales) || 0,
    lastUpdated: new Date(item.lastUpdated).toISOString(),
  }));
};





export const mapInstructorToAdminDTO = (instructor: any): InstructorAdminDTO => {
  return {
    id: instructor._id,
    name: instructor.name,
    email: instructor.email,
    profileImage: instructor.profileImage,
    KYCstatus: instructor.KYCstatus,
    blocked : instructor.blocked
    // totalPages: 1,
    // currentPage: 1,
    // totalInstructors: 3
  };
};



export const mapKycToDTO = (kyc: any): KycDTO => {
  return {
    id: kyc._id,
    status: kyc.status,
    documentType: kyc.documentType,
    documentUrl: kyc.documentUrl,
    submittedAt: kyc.createdAt
  };
};





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

