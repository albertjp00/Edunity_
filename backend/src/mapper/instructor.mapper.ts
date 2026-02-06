import { CategoryDTO } from "../dto/adminDTO";
import {
  EventDTO,
  ICourseDetailsDTO,
  IEarningsDTO,
  IEventDTO,
  IInstructorDashboardDTO,
  IInstructorProfileDTO,
  IModuleDTO,
  INotificationDTO,
  InstructorCourseDTO,
  InstructorDashboardRaw,
  IRecentStudentDTO,
  MessagedStudentsDTO,
  PurchaseDTO,
  QuizDTO,
  QuizQuestionDTO,
  TransactionDto,
  WalletDto,
} from "../dto/instructorDTO";
import { MessageDTO } from "../dto/userDTO";
import {
  InstructorDTO,
  IPurchaseDetails,
} from "../interfaces/instructorInterfaces";
import { IMessagedUser } from "../interfaces/userInterfaces";
import { ICategory } from "../models/category";
import { ICourse, IModule } from "../models/course";
import { IEarnings } from "../models/earnings";
import { IEvent } from "../models/events";
import { IInstructor } from "../models/instructor";
import { IMessage } from "../models/message";
import { INotification } from "../models/notification";
import { IQuestion, IQuiz } from "../models/quiz";
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
    blocked: instructor.blocked,
  };
};

export const mapInstructorCourseToDTO = (course: ICourse): InstructorCourseDTO => {
  return {
    id: course.id?.toString(),
    instructorId: course.instructorId ?? '',
    title: course.title,
    description: course.description ?? '',
    thumbnail: course.thumbnail ?? '',
    price: course.price ?? 0,
    skills: course.skills || [],
    level: course.level ?? '',
    category: course.category,
    totalEnrolled: course.totalEnrolled ?? 0,
    createdAt: course.createdAt ?? new Date(0),
    onPurchase: course.onPurchase,
  };
};

export const mapModuleToDTO = (module: IModule): IModuleDTO => ({
  id: module._id?.toString(),
  title: module.title,
  videoUrl: module.videoUrl ?? '',
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
  modules: course.modules?.map((m: IModule) => mapModuleToDTO(m)) ?? [],

  // rename "review" → "reviews"
  reviews: course.review ?? [],
});

export const mapEventToDTO = (event: IEvent): IEventDTO => {
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
    isOver: event.isOver,
  };
};

export const mapInstructorProfileToDTO = (
  profile: IInstructor,
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
    skills: profile.skills ?? [],
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

export const mapDashboardToDTO = (
  data: InstructorDashboardRaw,
): IInstructorDashboardDTO => {
  return {
    totalCourses: data.totalCourses,
    totalStudents: data.totalStudents,
    totalEarnings: data.totalEarnings,
    monthlyEarnings: data.monthlyEarnings,
    recentStudents:
      data.recentStudents?.map((s: IRecentStudentDTO) => ({
        name: s.name,
        email: s.email,
        course: s.course,
        date: s.date,
      })) || [],
  };
};

export const mapEarningsToDTO = (data: IEarningsDTO): IEarningsDTO => {
  return {
    monthlyEarnings:
      data.monthlyEarnings?.map((m: any) => ({
        month: m.month,
        earnings: m.earnings,
      })) || [],
    totalEarnings: data.totalEarnings,
  };
};

// wallet.mapper.ts

export const walleToDto = (wallet: IWallet): WalletDto => {
  return {
    userId: wallet.userId,
    balance: wallet.balance,
    transactions: wallet.transactions.map(
      (t): TransactionDto => ({
        type: t.type,
        amount: t.amount,
        courseId: t.courseId || "",
        description: t.description || "",
        createdAt: t.createdAt,
      }),
    ),
  };
};

export const mapPurchaseDetailsToDTO = (
  purchase: IPurchaseDetails,
): PurchaseDTO => {
  return {
    name: purchase.name,
    title: purchase.title,
    thumbnail: purchase.thumbnail,
    price: purchase.price,
    category: purchase.category,
    amountPaid: purchase.amountPaid,
    paymentStatus: purchase.paymentStatus,
    createdAt: purchase.createdAt,
  };
};

export const mapQuizToDTO = (quiz: IQuiz): QuizDTO => ({
  id: quiz.id.toString(),
  courseId: quiz.courseId,
  title: quiz.title,
  questions: (quiz.questions ?? []).map(mapQuizQuestionToDTO),
  createdAt: quiz.createdAt,
});

const mapQuizQuestionToDTO = (question: IQuestion): QuizQuestionDTO => ({
  id: question._id.toString(),
  question: question.question,
  options: question.options,
  points: question.points,
});

export const mapCategoryDTO = (data: ICategory): CategoryDTO => ({
  id: data.id,
  name: data.name,
  skills: data.skills,
});

export const mapEventsDTO = (data: IEvent): EventDTO => {
  return {
    id: data._id,
    instructorId: data.instructorId,
    instructorName: data.instructorName,
    title: data.title,
    description: data.description,
    topic: data.topic,
    date: data.date,
    time: data.time,
    participants: data.participants,
    isLive: data.isLive,
    isOver: data.isOver,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const mapEventDetailsDTO = (data: IEvent): EventDTO => {
  return {
    id: data._id,
    instructorId: data.instructorId,
    instructorName: data.instructorName,
    title: data.title,
    description: data.description,
    topic: data.topic,
    date: data.date,
    time: data.time,
    participants: data.participants,
    isLive: data.isLive,
    isOver: data.isOver,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const mapMessagedStudentsDTO = (data: IMessagedUser): MessagedStudentsDTO => {
  return {
    instructor: {
      _id: data.instructor._id.toString(),
      name: data.instructor.name,
    },
    lastMessage: {
      id: data.lastMessage._id.toString(),
      text: data.lastMessage.text || '',
      attachment: data.lastMessage.attachment || '',
      senderId: data.lastMessage.senderId,
      receiverId: data.lastMessage.receiverId,
      read: data.lastMessage.read,
      timestamp: data.lastMessage.timestamp,
    },
  };
};




export const mapMessageToDTO = (message: IMessage): MessageDTO => {
  return {
    _id: message._id.toString(),
    senderId: message.senderId,
    receiverId: message.receiverId,
    text: message.text ?? '',
    read: message.read,
    timestamp: message.timestamp,
    createdAt: message.createdAt,
    ...(message.attachment ? { attachment: message.attachment } : {}),
  };
};

