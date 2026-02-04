


export  interface IUser {
  email: string ;
  password : string ;
}

export interface IRegister{
  name: string ;
  email : string;
  password : string;
}



export interface IError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  
  message?: string;
}


export interface MyEvent {
  _id: string;
  eventId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}


export interface UEvent {
  _id:string
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  topic: string;
  date: Date;
  time: string
  duration: number;
  isLive: boolean;          
  createdAt: Date;
  updatedAt: Date;

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



//profile 

export interface IPayment {
  _id: string;
  amount: number;
  paymentDate: string;
  status: string;
  courseId: string;
  courseName : string
}



export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules?: string[];
}

export interface Favourite {
  _id: string;
  userId: string;
  courseId: string;
  thumbnail : string;
  title :string;
  description : string;
  course: Course;
  progress: {
    completedModules: string[];
  };
  createdAt: string;
}






export interface IInstructor {
  _id: string;
  name: string;
  email: string;
  expertise?: string;
  bio?: string;
  profileImage?: string;
  work?: string;
  education?: string;
}

export interface IModule {
  title: string;
  videoUrl: string;
  content: string;
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  modules: IModule[];
  review: IReview[]
}



export interface IMyCourse {
  _id: string;
  userId: string;
  course: ICourse;
  progress: {
    completedModules: string[];
  };
  enrolledAt: string;
}

export interface IReview {
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}



export interface IModule {
  title: string;
  videoUrl: string;
  content: string;
}



export interface IInstructor {
  name: string;
  profileImage?: string;
  bio?: string;
  expertise?: string;
}

export interface IReview {
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}


export interface RazorpayInstance {
  on(arg0: string, arg1: () => Promise<void>): unknown;
  open: () => void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}



// ---------- Message Interface ----------
export interface Message {
  senderId: string;
  receiverId?: string;
  text: string;
  attachment?: string;
  timestamp: Date | string;
  read?: boolean;
}

// ---------- ChatWindow Props ----------
export interface ChatWindowProps {
  userId: string;
  receiverId?: string;
  receiverName: string;
  receiverAvatar?: string;
  onMessageSent: (receiverId: string, message: string, file?: string) => void;
  unreadIncrease: (receiverId: string) => void;
  resetUnread: (receiverId: string) => void;
}

export interface IInstructorChat {
  id: string;
  _id?: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  time?: Date | string | null;
  unreadCount: number;
}


export interface IOption {
  text: string;
}

export interface IQuestion {
  _id: string;
  question: string;
  options: IOption[];
  correctAnswer: string;
  points: number;
}

export interface IQuiz {
  _id: string;
  courseId: string;
  title: string;
  questions: IQuestion[];
}


export interface EditForm {
    name: string,
    email: string,
    phone: string,
    bio: string,
    location: string,
    dob: string,
    gender: string,
    profileImage: string,
    
}


export interface User {
  id:string
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  gender?: string;
  dob?: string;
  location?: string;
  phone?: string;
  blocked?: boolean;
  googleId?: string;
  profileImage : string;
  provider : "google" | "local"
}

interface CourseData {
  id: string;
  _id?: string;
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


interface Transaction {
  type: "credit" | "debit";
  amount: number;
  courseId?: string;
  description?: string;
  createdAt: string;
}

export interface WalletData {
  userId: string;
  balance: number;
  transactions: Transaction[];
}


export interface UserRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}


export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  totalEnrolled?: number;
  duration?: string;
  instructorName?: string;
  instructorImage: string;
  category?: string;
  level?: string;
  moduleCount: number;
}



export interface RazorpayInstance {
  open: () => void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}



export interface IReport{
  reason :string | undefined;
  message: string | undefined;
}