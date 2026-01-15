export const ADMIN_ROUTES = {
  AUTH: {
    LOGIN: "/login",
  },

  USERS: {
    GET_ALL: "/getUsers",
    BLOCK_UNBLOCK: "/blockUser/:id",
    GET_USER: "/user/:id",
    GET_USER_COURSES: "/userCourses/:id",
  },

  INSTRUCTORS: {
    GET_ALL: "/getInstructors",
    GET_KYC: "/getKyc/:id",
    VERIFY_KYC: "/verifyKyc/:id",
    REJECT_KYC: "/rejectKyc/:id",
    GET_BY_ID: "/instructors/:id",
    GET_COURSES: "/instructorsCourses/:id",
  },

  COURSES: {
    GET_ALL: "/courses",
    GET_DETAILS: "/courseDetails/:id",
    GET_PURCHASES: "/purchases",
    EXPORT_PDF: "/exportPdf",
    BLOCK_COURSE:"/blockCourse/:id"
  },

  DASHBOARD: {
    STATS: "/stats",
    USER_OVERVIEW: "/userOverview",
    EARNINGS: "/getEarnings/:page",
  },

  CATEGORY:{
    ADD_CATEGORY:'/addCategory',
    GET_CATEGORY:'/getCategories',
    DELETE_CATEGORY:'/deleteCategory'
  }
};
