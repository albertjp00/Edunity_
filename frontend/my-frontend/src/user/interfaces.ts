


export  interface IUser {
  email: string ;
  password : string ;
}

export interface IRegister{
  name: string ;
  email : string;
  password : string;
}


export interface UEvent {
  _id: string;
  instructorName: string;
  title: string;
  description?: string;
  date: string;
  duration?: number;
  category?: string;

}


export interface UInstructor {
  _id: string;
  name: string;
  bio?: string;
  profileImage?: string;
}

// interface Event {
//   _id: string;
//   title: string;
//   description: string;
//   date: string;
//   duration: number;
//   instructorId: Instructor;
// }



export interface IInstructor {
  name: string;
  email: string;
  password: string;
  expertise?: string;
  bio?: string;
  profileImage?: string;
  KYCApproved: boolean;
  joinedAt: Date;
  KYCstatus: "pending" | "verified" | "rejected" | "notApplied";
  work?: string;
  education?: string;
  blocked?:boolean
}