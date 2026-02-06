import { WalletDto } from '../../dto/instructorDTO';
import { StatusMessage } from '../../enums/statusMessage';
import {  IUserRepository, UserDTO } from '../../interfaces/userInterfaces';
import { INotifications, IPaymentDetailsService, IUserProfileService } from '../../interfacesServices.ts/userServiceInterfaces';
import { walleToDto } from '../../mapper/instructor.mapper';
import { mapPayToDto, mapUserToDTO } from '../../mapper/user.mapper';
import { INotification } from '../../models/notification';
import { ISubscription, IUser } from '../../models/user';
import bcrypt from 'bcrypt'

export class ProfileService implements IUserProfileService {

  constructor(private userRepository: IUserRepository) {}



  async getProfile(userId: string):Promise<UserDTO | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) return null;

      const dto = mapUserToDTO(user)

      return dto
    } catch (error) {
      console.error('ProfileService.getProfile error:', error);
      throw new Error(StatusMessage.FAILED_TO_FETCH_DATA);
    }
  }



  async editProfileRequest(userId: string, updateData: Partial<IUser>):Promise<UserDTO | null> {
    try {
      const updatedUser = await this.userRepository.updateProfile(userId, updateData);
      if (!updatedUser) return null;

      const dto = mapUserToDTO(updatedUser)
      return dto
    } catch (error) {
      console.error('ProfileService.updateProfile error:', error);
      throw new Error(StatusMessage.PROFILE_UPDATE_FAILED);
    }
  }

  async passwordChange(id: string, newPassword: string, oldPassword: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) return false;

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      console.log(isMatch, oldPassword, user.password, newPassword);

      if (!isMatch) return false;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.userRepository.changePassword(id, hashedPassword);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getWallet(userId: string): Promise<WalletDto | null> {
    try {
      const wallet = await this.userRepository.getWallet(userId)
      if(!wallet) return null
      return walleToDto(wallet)
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getPayment(userId: string , page:number): Promise<IPaymentDetailsService | null> {
    try {
      const result = await this.userRepository.getPayment(userId , page)
      if (!result) return null
      console.log('pay',result);
      
      return {pay :result?.pay.map(mapPayToDto),totalPages:result.totalPages,total : result.total , currentPage : result.total}
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getNotifications(userId: string , page :number): Promise<INotifications | null> {
    try {
      const noti = await this.userRepository.getNotifications(userId , page)
      return noti
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async notificationsMarkRead(userId: string): Promise<INotification[] | null> {
    try {
      const noti = await this.userRepository.notificationsMarkRead(userId)
      return noti
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async subscriptionCheckRequest(id: string): Promise<ISubscription | boolean | null> {
    try {
      const user = await this.userRepository.getSubscriptionActive(id)
      return user
    } catch (error) {
      console.log(error);
      return null
    }
  }

}
