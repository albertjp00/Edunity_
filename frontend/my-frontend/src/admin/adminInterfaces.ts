export interface IInstructor {
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



// to show user details

export interface User {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  gender?: string;
  dob?: string;
  location?: string;
  phone?: string;
  blocked?: boolean;
}

export interface CourseData {
  _id: string;
  title: string;
  price: number | string;
  description?: string;
  thumbnail: string;
  modules?: { id: string; title: string }[];
}

export interface EnrolledCourse {
  course: CourseData;
  progress: { completedModules: string[] };
  userId: string;
}


export interface AdminUserCourses{
  _id:string;
  id:string;
  title : string;
  thumbnail : string;
}