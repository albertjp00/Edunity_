export const INSTRUCTOR_ROUTES = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    RESEND_OTP: "/resendOtp",
    VERIFY_OTP: "/verifyOtp",

    FORGOT_PASSWORD: "/forgotPassword",
    OTP_VERIFY_FORGOT: "/otpVerify",
    RESEND_FORGOT_OTP: "/resendOtpForgotPass",
    RESET_PASSWORD: "/resetPassword",
  },

  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    CHANGE_PASSWORD: "/passwordChange",
    KYC_SUBMIT: "/kycSubmit",
    DASHBOARD: "/dashboard",
    EARNINGS: "/earnings",
    NOTIFICATIONS: "/notifications",
    WALLET: "/wallet",
  },

  COURSE: {
    GET_MY_COURSES: "/getCourse",
    DETAILS: "/course/:id",
    REFRESH_VIDEO: "/videos/refresh",
    EDIT: "/course/:id",
    ADD: "/course",

    PURCHASE_DETAILS: "/purchaseDetails/:id",

    ADD_QUIZ: "/addQuiz/:id",
    GET_QUIZ: "/quiz/:courseId",
    EDIT_QUIZ: "/quiz/:quizId",
  },

  EVENTS: {
    CREATE: "/event",
    LIST: "/event",
    GET: "/getEvent/:id",
    EDIT: "/event/:id",
    LIST_ALL: "/allEvents",
    JOIN_EVENT: "/joinEvent/:eventId",
  },

  CHAT: {
    MESSAGED_STUDENTS: "/getMessagedStudents",
    MESSAGES: "/messages/:receiverId",
    SEND_MESSAGE: "/sendMessage/:receiverId",
  },
};
