import { QuizDTO } from "../dto/instructorDTO";
import {
  CourseDetailsDTO,
  CourseDocument,
  CourseModuleDTO,
  CourseViewDTO,
  CourseWithAccessDTO,
  FavCourseDTO,
  FavoriteCourseDTO,
  ICoursePopulated,
  LoginDTO,
  MyCourseDTO,
  QuizUserDTO,
  SubscriptionCourseDTO,
  UserInstructorDTO,
} from "../dto/userDTO";
import { UserDTO } from "../interfaces/userInterfaces";
import { IFavourites, IQuizService } from "../interfacesServices.ts/userServiceInterfaces";
import { IFavourite } from "../models/favourites";
import { IInstructor } from "../models/instructor";
import { IQuiz } from "../models/quiz";
import { IUser } from "../models/user";

export const mapUserToDTO = (user: IUser): UserDTO => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    bio: user.bio,
    profileImage: user.profileImage,
    gender: user.gender,
    dob: user.dob,
    blocked: user.blocked,
    provider: user.provider,
    location: user.location,
    phone: user.phone,
    createdAt: user.createdAt,
  };
};

export const LoginMapper = (login: any): LoginDTO => {
  return {
    success: true,
    message: login.message,
    accessToken: login.accessToken,
    refreshToken: login.refreshToken,
  };
};

export const mapCourse = (course: any) => {
  if (!course) return null;

  return {
    id: course._id,
    title: course.title,
    thumbnail: course.thumbnail,
    description: course.description,
    level: course.level,
    skills: course.skills,
    price: course.price,
    accessType: course.accessType,
    onPurchase: course.onPurchase,
    instructorId: course.instructorId,

    // optional (only if populated)
    instructorName: course.instructor?.name || null,
    instructorImage: course.instructor?.profileImage || null,

    createdAt: course.createdAt,
  };
};

export const mapAllCourseToDTO = (course: CourseDocument): CourseDetailsDTO => {
  return {
    _id: course._id.toString(),
    title: course.title,
    description: course.description,
    price: course.price,
    skills: course.skills,
    level: course.level,
    category: course.category,
    totalEnrolled: course.totalEnrolled,
    createdAt: course.createdAt,
    thumbnail: course.thumbnail,
    blocked: course.blocked,
    moduleCount: course.moduleCount,
    instructorName: course.instructorName,
    instructorImage: course.instructorImage,
  };
};

export const mapCourseWithAccessToDTO = (
  course: any,
  hasAccess: boolean,
  completedModules: string[],
): CourseWithAccessDTO => {
  const rawCourse = course.toObject?.() || course;

  return {
    _id: rawCourse._id.toString(),
    instructorId: rawCourse.instructorId,
    title: rawCourse.title,
    description: rawCourse.description,
    price: rawCourse.price,
    skills: rawCourse.skills,
    level: rawCourse.level,
    category: rawCourse.category,
    totalEnrolled: rawCourse.totalEnrolled,
    accessType: rawCourse.accessType,
    onPurchase: rawCourse.onPurchase,
    thumbnail: rawCourse.thumbnail,
    createdAt: rawCourse.createdAt,

    modules: rawCourse.modules.map((module: any) => ({
      id: module._id.toString(),
      title: module.title,
      videoUrl: module.videoUrl,
      content: module.content,
    })),

    instructor: {
      id: rawCourse.instructor._id.toString(),
      name: rawCourse.instructor.name,
      expertise: rawCourse.instructor.expertise,
      profileImage: rawCourse.instructor.profileImage,
      bio: rawCourse.instructor.bio,
      education: rawCourse.instructor.education,
      work: rawCourse.instructor.work,
      skills: rawCourse.instructor.skills,
    },

    hasAccess,
    completedModules,
  };
};

export const mapMyCourseToDTO = (myCourse: any): MyCourseDTO => {
  const raw = myCourse.toObject?.() || myCourse;
  const course = raw.course;

  return {
    _id: raw._id.toString(),
    courseId: raw.courseId.toString(),
    paymentStatus: raw.paymentStatus,
    cancelCourse: raw.cancelCourse,
    blocked: raw.blocked,
    createdAt: raw.createdAt,
    completedModules: raw.progress?.completedModules || [],

    course: {
      _id: course._id.toString(),
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      price: course.price,
      skills: course.skills,
      level: course.level,
      category: course.category,
      totalEnrolled: course.totalEnrolled,
      accessType: course.accessType,
    },
  };
};

export const mapMyCoursesListToDTO = (courses: any[]) => {
  return courses.map(mapMyCourseToDTO);
};

export const mapSubscriptionCourseToDTO = (
  course: any,
): SubscriptionCourseDTO => {
  const raw = course.toObject?.() || course;

  return {
    _id: raw._id.toString(),
    title: raw.title,
    description: raw.description,
    price: raw.price,
    skills: raw.skills,
    level: raw.level,
    modules: raw.modules,
    category: raw.category,
    totalEnrolled: raw.totalEnrolled,
    accessType: raw.accessType,
    thumbnail: raw.thumbnail,
    createdAt: raw.createdAt,
  };
};

export const mapCourseToViewDTO = (course: any): CourseViewDTO => {
  return {
    _id: course._id.toString(),
    instructorId: course.instructorId,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    price: course.price,
    skills: course.skills ?? [],
    level: course.level,
    category: course.category,
    accessType: course.accessType,
    totalEnrolled: course.totalEnrolled ?? 0,
    onPurchase: course.onPurchase ?? false,
    blocked: course.blocked ?? false,
    createdAt: course.createdAt,
    reviewCount: course.review?.length ?? 0,

    modules: (course.modules ?? []).map(
      (module: any): CourseModuleDTO => ({
        title: module.title,
        id: module._id.toString(),
        videoUrl: module.videoUrl,
      }),
    ),
  };
};

export const mapUserInstructorDto = (
  instructor: IInstructor,
): UserInstructorDTO => {
  return {
    name: instructor.name,
    expertise: instructor.expertise ?? "",
    profileImage: instructor.profileImage ?? "",
  };
};

export const mapFavoriteToDTO = (fav: IFavourites): FavoriteCourseDTO => {
  const { course } = fav;

  return {
    _id: fav._id.toString(),
    userId: fav.userId,
    courseId: fav.courseId,
    course: {
      _id: course._id.toString(),
      title: course.title,
      description: course.description ?? "",
      thumbnail: course.thumbnail ?? "",
      price: course.price ?? 0,
      skills: course.skills ?? [],
      level: course.level ?? "",
      modules: course.modules ?? [],
      totalEnrolled: course.totalEnrolled ?? 0,
      category: course.category,
      accessType: course.accessType,
      onPurchase: course.onPurchase,
      blocked: course.blocked,
      createdAt: course.createdAt!,
    },
  };
};

export const mapFavCourseToDTO = (course: ICoursePopulated): FavCourseDTO => {
  return {
    _id: course._id.toString(),
    instructorId: course.instructorId,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    price: course.price,
    skills: course.skills,
    modules: course.modules.map((m) => ({
      _id: m._id.toString(),
      title: m.title,
      content: m.content,
      ...(m.videoUrl ? { videoUrl: m.videoUrl } : {}),
    })),

    totalEnrolled: course.totalEnrolled,
    createdAt: course.createdAt,
    level: course.level,
    category: course.category,
    blocked: course.blocked,
    accessType: course.accessType,
    onPurchase: course.onPurchase,
    instructor: {
  _id: course.instructor._id.toString(),
  name: course.instructor.name,
  email: course.instructor.email,
  expertise: course.instructor.expertise,
  KYCApproved: course.instructor.KYCApproved,
  joinedAt: course.instructor.joinedAt,
  KYCstatus: course.instructor.KYCstatus,
  blocked: course.instructor.blocked,
  skills: course.instructor.skills,

  ...(course.instructor.profileImage
    ? { profileImage: course.instructor.profileImage }
    : {}),

  ...(course.instructor.bio
    ? { bio: course.instructor.bio }
    : {}),

  ...(course.instructor.education
    ? { education: course.instructor.education }
    : {}),

  ...(course.instructor.work
    ? { work: course.instructor.work }
    : {}),
},

    hasAccess: course.hasAccess,
    completedModules: course.completedModules.map((id) => id.toString()),
  };
};



export const mapQuizToDTO = (quiz: IQuizService): QuizUserDTO => {
  return {
    _id: quiz._id.toString(),
    courseId: quiz.courseId,
    title: quiz.title,
    questions: quiz.questions.map((q) => ({
  id: q._id.toString(),
  question: q.question,
  options: q.options,
  correctAnswer: q.correctAnswer,
  points: q.points,
})),

  };
};
