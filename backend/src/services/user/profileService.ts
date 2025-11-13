import { INotification } from '../../models/notification.js';
import { IPayment } from '../../models/payment.js';
import { IWallet } from '../../models/wallet.js';
import { UserRepository } from '../../repositories/userRepository.js';
import bcrypt from 'bcrypt'

export class ProfileService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }


  //   interface userDetails {
  //     name  : string ,
  //     email : string ,
  //     role: string,
  //   }

  async getProfile(userId: string) {
    try {
      console.log("profile services ", userId);

      const user = await this.userRepository.findById(userId);
      if (!user) return null;

      const { password, ...userWithoutPassword } = user.toObject();
      //   console.log(userWithoutPassword);

      return userWithoutPassword;
    } catch (error) {
      console.error('ProfileService.getProfile error:', error);
      throw new Error('Failed to get profile');
    }
  }

  

  async editProfileRequest(userId: string, updateData: Partial<any>) {
    try {
      console.log('id data', userId, updateData);

      const updatedUser = await this.userRepository.updateProfile(userId, updateData);
      if (!updatedUser) return null;

      const { password, ...userWithoutPassword } = updatedUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      console.error('ProfileService.updateProfile error:', error);
      throw new Error('Failed to update profile');
    }
  }

  async passwordChange(id: string, newPassword: string, oldPassword: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) return false;
      
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      console.log(isMatch , oldPassword , user.password , newPassword);
      
      if (!isMatch) return false;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.userRepository.changePassword(id, hashedPassword);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getWallet (userId : string ):Promise<IWallet | null>{
    try {
      const wallet = await this.userRepository.getWallet(userId)
      return wallet 
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getPayment (userId : string ):Promise<IPayment[] | null>{
    try {
      const pay = await this.userRepository.getPayment(userId)
      if(!pay) return null
      return pay 
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getNotifications (userId : string ):Promise<INotification[] | null>{
    try {
      const noti = await this.userRepository.getNotifications(userId)
      return noti
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async notificationsMarkRead (userId : string ):Promise<INotification[] | null>{
    try {
      const noti = await this.userRepository.notificationsMarkRead(userId)
      return noti
    } catch (error) {
      console.log(error);
      return null
    }
  }


}
