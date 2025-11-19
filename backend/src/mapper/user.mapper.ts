import { UserDTO } from "../interfaces/userInterfaces";
import { IUser } from "../models/user";



export const mapUserToDTO = (user: IUser): UserDTO => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    bio: user.bio,
    image: user.profileImage,
    gender : user.gender,
    dob : user.dob,
    location : user.location,
    phone : user.phone,
    createdAt: user.createdAt.toISOString()
  };
};
