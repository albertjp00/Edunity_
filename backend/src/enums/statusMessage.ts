export enum StatusMessage{
    LOGIN_SUCCESS = 'login success',
    LOGIN_FAILED = 'LOGIN FAILED',
    REGISTRATION_FAILED = 'registration failed',
    EMAIL_REQUIRED = 'email required',
    PASSWORD_CHANGED = "Password changed successfully",
    INCORRECT_PASSWORD = 'incorrect password',
    EMAIL_AND_PASWWORD = 'email and password required',
    RESET_FAILED = 'password reset failed',

    TITLE_DES_DATE = "Title, description, and date are required",

    INTERNAL_SERVER_ERROR = "Something went wrong. Please try again later.",
    SOMETHING_WRONG = "Something went wrong",
    UNAUTHORIZED = "Unauthorized",
    INVALID_SIGNATURE = 'invalid signature',

    USER_NOT_FOUND  ="User not found",
    BLOCKED = "Your account is blocked",
    INSTRUCTOR_NOT_FOUND = 'instructor not found',
    EMAIL_EXISTS = "Email already registered",
    EMAIL_NOT_EXISTS = 'Email doesnt exist',

    TOKEN_REQUIRED = "Refresh token required",
    INVALID_REFRESH_TOKEN= "Invalid refresh token",
    GOOGLE_SIGN_IN_FALIED = "Google Sign-In failed",
    PAYMENT_FAILURE = "Payment initiation failed",
    PAYMENT_VERIFICATION_FAILURE="Payment verification failed",
    PAYMENT_ALREADY_PROGRESS = "Payment already initiated for this course.",
    
    OTP_SEND_to_MAIL     = 'otp sent to your mail',
    OTP_VERIFIED = 'otp verified',
    OTP_VERIFICATION_FAILED = "otp verification failed",
    OTP_SENT =  "OTP SENDED",
    OTP_RESEND_FAILED = "Failed to resend OTP",
    OTP_NOT_FOUND = "OTP not found or expired",
    OTP_EXPIRED  = "OTP expired",
    INVALID_OTP = 'invalid otp',

    MISSING_KEY = 'missing key',
    ERROR_LINK = "Error generating URL",

    MISSING_FIELDS = "Missing required fields",
    QUIZ_NOT_FOUND = 'quiz not found',

    PROFILE_UPDATED = 'Profile updated successfully',
    PROFILE_NOT_FOUND = 'profile not found',
    PROFILE_UPDATE_FAILED = 'Failed to update profile',

    FAILED_TO_SEND_MESSAGE = "Failed to send message",

    EVENT_JOINED = 'event joined',
    NO_EVENT_ID = "event Id missing",
    EVENT_DATE_ERROR = "Event date must be today or a future date",
    FAILED_TO_START = "Failed to start event",
    FAILED_TO_END = "Failed to end event",
    NO_EVENT_FOUND = 'no event found',
    EVENT_NOT_STARTED = "Event has not started yet",

    COURSE_ADDED = "Payment verified and course added",
    COURSE_ALREADY_EXISTS = "Course already exists in favourites",
    ERROR_ADDING_COURSE = "Error adding course",
    PURCHASE_NOT_FOUND  = "No purchase found",
    COURSE_NOT_FOUND = "Course not found",
    FAILED_TO_GET_COURSES  = "Failed to get courses",
    FAILED_TO_GET_COURSE_DETAILS = "Failed to fetch course details",
    FAILED_TO_FETCH_DATA = 'failed to fetch data',
    COURSE_NOT_COMPLETED = "Course not completed yet, cannot generate certificate",
    ERROR_CERTIFICATE = "Error generating certificate",
    NOT_ENROLLED = "User not enrolled in this course"
}