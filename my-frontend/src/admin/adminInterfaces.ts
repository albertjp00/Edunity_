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


export interface ICategory{
  _id:string
  name:string
  skills:string[]
}

export interface Course {
  id:string;
  title: string;
  instructorName: string;
  category: string;
  price: number;
  thumbnail?: string;
  blocked: boolean | undefined; 
}

export interface Module {
  title: string;
  videoUrl?: string;
  content?: string;
}

export interface CourseDetails {
  _id: string;
  id:string;
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnail?: string;
  skills?: string[];
  modules: Module[];

}

export interface DashboardStats {
  totalUsers: number;
  totalInstructors: number;
  totalCourses: number;
  totalEnrolled: number;

  totalEarnings: number;
  activeUsers: number;
  statsChange: {
    instructors: number;
    courses: number;
    enrolled: number;
    events: number;
    earnings: number;
  };
}

export interface IEarning {
  _id: string;
  coursePrice: number;
  adminEarnings: number;
  instructorEarnings: number;
  totalEarnings: number;
  lastUpdated: string;
  
}


export interface KycDetails {
  instructorId: string
  idProof: string
  addressProof: string
}


export interface Purchase {
  _id: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  coursePrice: number;
  amountPaid: number;
  paymentStatus: string;
  createdAt: string;
  purchasedAt: string;
}


interface Column<T> {
  label: string;
  render: (item: T) => React.ReactNode;
  width?: string;
}

export interface AdminListProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}


export interface Instructor {
  _id: string;
  id:string;
  name: string;
  email: string;
  profileImage?: string;
  KYCstatus: 'notApplied' | 'verified' | 'pending' | 'rejected';
  blocked : boolean
}

export interface LoginFormData {
  email: string;
  password: string;
}


export interface IReportAdmin{
  _id : string,
  reason:string,
  message?:string,
  courseId : string;
  userId : string;
  createdAt : Date
}




export interface CreateSubscriptionDTO {
  name: string;
  price: number;
  durationInDays: number;
  features: string[];
  isActive: boolean;
}
