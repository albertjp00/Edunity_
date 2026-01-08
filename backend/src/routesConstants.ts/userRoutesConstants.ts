export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    GOOGLE_LOGIN: "/auth/googleLogin",
    REFRESH_TOKEN: "/refresh-token",
    LOGOUT: "/logout",
    IS_BLOCKED: "/isBlocked",

    FORGOT_PASSWORD: "/forgotPassword",
    OTP_VERIFY: "/otpVerify",
    RESEND_FORGOT_OTP: "/resendOtpForgotPass",
    RESET_PASSWORD: "/resetPassword",

    REGISTER: "/register",
    VERIFY_OTP: "/verifyOtp",
    RESEND_OTP: "/resendOtp",
  },

  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    CHANGE_PASSWORD: "/passwordChange",
    WALLET: "/wallet",
    PAYMENT: "/payment/:page",
    NOTIFICATIONS: "/notifications",
    MARK_READ: "/notificationsMarkRead",
  },

  COURSES: {
    GET_COURSES: "/getCourses",
    GET_ALL: "/getAllCourses",
    DETAILS: "/courseDetails",
    REFRESH_VIDEO: "/refresh",
    CERTIFICATE: "/certificate/:courseId",
    ADD_REVIEW: "/review",

    MY_COURSES: "/myCourses/:page",
    GET_INSTRUCTORS: "/getInstructors",
    FAVOURITES: "/getFavourites",
    ADD_FAVOURITES: "/addtoFavourites/:id",
    FAV_COURSE_DETAILS: "/favouritesCourseDetails/:id",

    BUY: "/buyCourse/:id",
    VERIFY_PAYMENT: "/payment/verify",
    CANCEL_PAYMENT: "/cancelPayment/:courseId",

    BUY_SUB:"/subscribe",
    VERIFY_SUBSCRIPTION_PAYMENT: "/paymentSubscription/verify",
    SUB_CHECK : '/getSubscription',
    SUB_COURSES : '/getSubscriptionCourses/:page',

    VIEW_MY_COURSE: "/viewMyCourse/:id",
    UPDATE_PROGRESS: "/updateProgress",

    QUIZ: "/quiz/:courseId",
    SUBMIT_QUIZ: "/quiz/:courseId/:quizId",

    CANCEL_COURSE: "/cancelCourse/:id",
  },

  EVENTS: {
    LIST: "/events",
    DETAILS: "/event/:id",
    ENROLL: "/eventEnroll/:id",
    MY_EVENTS: "/myEvents",
    JOIN: "/joinEvent/:eventId",
  },

  CHAT: {
    SEND: "/chat",
    GET_INSTRUCTOR: "/getInstructor/:instructorId",
    HISTORY: "/messages/:userId/:receiverId",
    MESSAGED_INSTRUCTORS: "/messagedInstructors",
    UNREAD_MESSAGES: "/getUnreadMessages/:instructorId",
    INSTRUCTOR_TO_MESSAGE: "/instructor/:id",
  },
};
