import { UserRepository } from '../../repositories/userRepository.js';

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

  // Get profile by user ID
  async getProfile(userId: string) {
    try {
        console.log("profile services " ,userId);
        
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

  // Update profile by user ID
  async editProfileRequest(userId: string, updateData: Partial<any>) {
    try {
      console.log('id data',userId , updateData);
      
      const updatedUser = await this.userRepository.updateById(userId, updateData);
      if (!updatedUser) return null;

      const { password, ...userWithoutPassword } = updatedUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      console.error('ProfileService.updateProfile error:', error);
      throw new Error('Failed to update profile');
    }
  }
}
