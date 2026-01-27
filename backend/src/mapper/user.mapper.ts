import { LoginDTO } from "../dto/userDTO";
import { UserDTO } from "../interfaces/userInterfaces";
import { IUser } from "../models/user";



export const mapUserToDTO = (user: IUser): UserDTO => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    bio: user.bio,
    profileImage: user.profileImage,
    gender : user.gender,
    dob : user.dob,
    blocked : user.blocked,
    provider : user.provider,
    location : user.location,
    phone : user.phone,
    createdAt: user.createdAt
  };
};



export const LoginMapper =(login:any): LoginDTO => {
    return {
      message:login.message,
      accessToken : login.accessToken,
    };
  }



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
