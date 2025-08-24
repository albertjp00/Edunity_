export interface IUser {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  expertise?: string;
  KYCstatus?: 'verified' | 'pending' | 'rejected' | string;
  education?: string;
  work?: string;
}

export interface ICourse {
  _id: string;
  title: string;
  thumbnail?: string;
  level?: string;
  price?: number;
}