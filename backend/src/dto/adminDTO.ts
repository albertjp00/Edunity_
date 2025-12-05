export interface AdminLoginDTO {
  success: boolean;
  message: string;
  token?: string;
}


export interface CourseDTO {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  instructorName: string;
  createdAt: Date;
  category : string;
}

export interface CourseDetailsDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  enrolledUsers: number;
}

export interface PurchaseDTO {
  id: string;
  userName: string;
  courseTitle: string;
  coursePrice: number;
  amountPaid : number;
  paymentStatus:string;
  purchasedAt: Date;
}



// Dashboard summary numbers
export interface StatsDTO {
  totalUsers: number;
  totalInstructors: number;
  totalCourses: number;
  totalEarnings: number;
}

// Bar/Chart overview of users
export interface UserOverviewDTO {
  name: string;
  count: number;
}

// Earnings chart
export interface EarningsDTO {
  total : number
}



export interface InstructorAdminDTO {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    KYCstatus: string;
}

export interface KycDTO {
    id: string;
    status: string;
    documentType: string;
    documentUrl: string;
    submittedAt: Date;
}

// export interface CourseDTO {
//     id: string;
//     title: string;
//     description: string;
//     thumbnail: string;
//     price: number;
//     level: string;
//     category: string;
//     isPublished: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }



export interface UserDTO {
    id: string;
    name: string;
    email: string;
    picture?: string;
    isBlocked: boolean;
    createdAt: Date;
}


export interface UserCourseDTO {
    id: string;
    title: string;
    thumbnail?: string;
    progress?: number;
    purchasedAt: Date;
}
