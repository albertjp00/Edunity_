import { InstructorRepository } from "../../repositories/instructorRepository.js";
import bcrypt from 'bcrypt'



export class InstructorProfileService {
  private instructorRepository: InstructorRepository

  constructor(instructorRepository: InstructorRepository) {
    this.instructorRepository = instructorRepository
  }
  async getProfile(userId: string) {
    try {
      // console.log("profile services instructor " ,userId);

      const user = await this.instructorRepository.findById(userId);
      if (!user) return null;

      const { password, ...userWithoutPassword } = user.toObject();
      //   console.log(userWithoutPassword);

      return userWithoutPassword;
    } catch (error) {
      console.error('ProfileService.getProfile error:', error);
      throw new Error('Failed to get profile');
    }
  }

  async editProfileRequest(id: string, updateData: Partial<any>) {
    try {
      console.log('id data', id, updateData);

      const updatedUser = await this.instructorRepository.updateProfile(id, updateData);
      // console.log('updatede',updatedUser);

      if (!updatedUser) return null;

      return true
    } catch (error) {
      console.error('ProfileService.updateProfile error:', error);
      throw new Error('Failed to update profile');
    }
  }

  async passwordChange(id: string, newPassword: string, oldPassword: string): Promise<boolean> {
    try {
      const instructor = await this.instructorRepository.findById(id);
      if (!instructor) return false;

      const isMatch = await bcrypt.compare(oldPassword, instructor.password);
      if (!isMatch) return false;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.instructorRepository.updatePassword(id, hashedPassword);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }



}