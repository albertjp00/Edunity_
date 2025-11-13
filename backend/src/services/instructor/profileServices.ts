import { IEarnings } from "../../models/earnings.js";
import { INotification } from "../../models/notification.js";
import { IWallet } from "../../models/wallet.js";
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

  kycSubmit = async(id : string , idProof:string,addressProof:string):Promise<boolean | null>=>{
    try {
      const save = await this.instructorRepository.kycSubmit(id , idProof,addressProof)
      return true
    } catch (error) {
      console.log(error);
      return null
    }
  }

    getNotifications = async(id : string):Promise<INotification[] | null>=>{
    try {
      const notifications = await this.instructorRepository.getNotifications(id)
      return notifications
    } catch (error) {
      console.log(error);
      return null
    }
  }

  getDashboard = async(id : string):Promise<void>=>{
    try {
      const data = await this.instructorRepository.getDashboard(id)
      
      return data
    } catch (error) {
      console.log(error);
    }
  }


  getEarnings = async(id : string):Promise<{ monthlyEarnings:{month:string , earnings: number }[] , totalEarnings:number }| null>=>{
    try {
      const monthlyEarnings = await this.instructorRepository.getMonthlyEarnings(id)
      const totalEarnings = await this.instructorRepository.totalEarnings(id) ?? 0
    
      return {monthlyEarnings , totalEarnings}
    } catch (error) {
      console.log(error);
      return null 
    }
  }

  getWallet = async(id : string):Promise<IWallet | null>=>{
    try {
      const wallet = await this.instructorRepository.getWallet(id)
    
      return wallet
    } catch (error) {
      console.log(error); 
      return null 
    }
  }



}