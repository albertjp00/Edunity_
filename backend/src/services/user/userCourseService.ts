import { ICourse } from '../../models/course.js';
import { ISkills } from '../../repositories/instructorRepository.js';
import { UserRepository } from '../../repositories/userRepository.js';
import bcrypt from 'bcrypt'

interface CourseResult {
  courses: ICourse[] | null;
  skills: ISkills;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export class UserCourseService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async getCourses(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const courses = await this.userRepository.getCourses(skip, limit);
  const totalCourses = await this.userRepository.countCourses();
  const skills = await this.userRepository.findSkills();

  return {
    courses,
    skills,
    totalPages: Math.ceil(totalCourses / limit),
    currentPage: page
  };
}

}