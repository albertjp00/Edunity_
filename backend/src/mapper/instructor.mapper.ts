import { ICourseDetailsDTO, IEarningsDTO, IEventDTO, IInstructorDashboardDTO, IInstructorProfileDTO, IModuleDTO, INotificationDTO, InstructorCourseDTO, TransactionDto, WalletDto } from "../dto/instructorDTO";
import { InstructorDTO } from "../interfaces/instructorInterfaces";
import { IInstructor } from "../models/instructor";
import { INotification } from "../models/notification";
import { IWallet } from "../models/wallet";




export const mapInstructorToDTO = (instructor: IInstructor): InstructorDTO => {
  return {
    _id: instructor.id,
    name: instructor.name,
    email: instructor.email,
    expertise: instructor.expertise,
    bio: instructor.bio,
    profileImage: instructor.profileImage,
    KYCApproved: instructor.KYCApproved,
    joinedAt: instructor.joinedAt,
    KYCstatus: instructor.KYCstatus,
    work: instructor.work,
    education: instructor.education,
    blocked: instructor.blocked
  };
};




export const mapInstructorCourseToDTO = (course: any): InstructorCourseDTO => {
  return {
    id: course._id?.toString(),
    instructorId: course.instructorId,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    price: course.price,
    skills: course.skills || [],
    level: course.level,
    category: course.category,
    totalEnrolled: course.totalEnrolled,
    createdAt: course.createdAt,
    onPurchase: course.onPurchase
  };
};



export const mapModuleToDTO = (module: any): IModuleDTO => ({
  id: module._id?.toString(),
  title: module.title,
  videoUrl: module.videoUrl,
  content: module.content,
});


export const mapCourseDetailsToDTO = (course: any): ICourseDetailsDTO => ({
  id: course._id.toString(),
  instructorId: course.instructorId,
  title: course.title,
  description: course.description,
  thumbnail: course.thumbnail,
  price: course.price,
  totalEnrolled: course.totalEnrolled,
  skills: course.skills,
  level: course.level,
  category: course.category,
  createdAt: course.createdAt,

  // map modules
  modules: course.modules?.map((m: any) => mapModuleToDTO(m)) ?? [],

  // rename "review" → "reviews"
  reviews: course.review ?? [],
});



export const mapEventToDTO = (event: any): IEventDTO => {
  return {
    id: event._id.toString(),
    title: event.title,
    description: event.description,
    topic: event.topic,
    date: event.date,
    time: event.time,
    participants: event.participants,
    isLive: event.isLive,
    meetingLink: event.meetingLink ?? null,
    isOver:event.isOver
  };
};



export const mapInstructorProfileToDTO = (
  profile: IInstructor
): IInstructorProfileDTO => {
  return {
    _id: profile._id.toString(),
    name: profile.name,
    email: profile.email,
    expertise: profile.expertise ?? "",
    bio: profile.bio ?? "",
    profileImage: profile.profileImage ?? "",
    KYCApproved: profile.KYCApproved,
    KYCstatus: profile.KYCstatus,
    work: profile.work ?? "",
    education: profile.education ?? "",
    blocked: profile.blocked ?? false,
    skills:profile.skills ?? []
  };
};



export const mapNotificationToDTO = (n: INotification): INotificationDTO => {
  return {
    _id: n._id.toString(),
    recipientId: n.recipientId,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
  };
};


export const mapDashboardToDTO = (data: any): IInstructorDashboardDTO => {
  return {
    totalCourses: data.totalCourses,
    totalStudents: data.totalStudents,
    totalEarnings: data.totalEarnings,
    monthlyEarnings: data.monthlyEarnings,
    recentStudents: data.recentStudents?.map((s: any) => ({
      name: s.name,
      email: s.email,
      course: s.course,
      date: s.date
    })) || []
  };
};


export const mapEarningsToDTO = (data: any): IEarningsDTO => {
  return {
    monthlyEarnings: data.monthlyEarnings?.map((m: any) => ({
      month: m.month,
      earnings: m.earnings
    })) || [],
    totalEarnings: data.totalEarnings
  };
};


// wallet.mapper.ts


export const walleToDto = (wallet: IWallet): WalletDto => {
    return {
      userId: wallet.userId,
      balance: wallet.balance,
      transactions: wallet.transactions.map((t): TransactionDto => ({
        type: t.type,
        amount: t.amount,
        courseId: t.courseId || '',
        description: t.description || '',
        createdAt: t.createdAt,
      })),
    };
  }


