import { ICourseDetailsDTO } from "./instructorDTO";




export interface LoginDTO {
  message: string;
  accessToken: string;
}





export const courseDTO = (course: ICourseDetailsDTO) => {
  return {
    id: course.id,
    title: course.title,
    thumbnail: course.thumbnail,
    skills: course.skills,
    level: course.level,
    instructorId: course.instructorId,
    price: course.price,
    createdAt: course.createdAt,
  };
};
