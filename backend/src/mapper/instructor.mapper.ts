import { InstructorDTO } from "../interfaces/instructorInterfaces";
import { IInstructor } from "../models/instructor";




export const mapInstructorToDTO = (instructor: IInstructor): InstructorDTO => {
    return {
        _id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        expertise: instructor.expertise,
        bio: instructor.bio,
        profileImage: instructor.profileImage,
        KYCApproved: instructor.KYCApproved,
        joinedAt: instructor.joinedAt,
        KYCstatus: instructor.KYCstatus,
        work: instructor.work,
        education: instructor.education,
        blocked: instructor.blocked
    };
};
