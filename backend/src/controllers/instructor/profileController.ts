import { Request, Response } from 'express';
import { AuthRequest, InstAuthRequest } from '../../middleware/authMiddleware.js';
import { InstructorRepository } from '../../repositories/instructorRepository.js';
import { InstructorProfileService } from '../../services/instructor/profileServices.js';

export class InstProfileController {
    private profileService: InstructorProfileService;

    constructor() {
        const repo = new InstructorRepository();
        this.profileService = new InstructorProfileService(repo);
    }



    getProfile = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.instructor?.id
            console.log('instructor get profile ', userId);
            

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const profile = await this.profileService.getProfile(userId);
            console.log(profile);
            

            if (profile) {
                res.status(200).json({data:profile});
            } else {
                res.status(404).json({ error: 'Profile not found' });
            }
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };



    editProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            console.log('user profiel ', req.user?.id , req.file)
            const userId = req.user?.id; // Assuming `req.user` is set by auth middleware
            const updateData = req.body;
    

            const data = {...req.body}
            const file = req.file?.filename

            data.profileImage = file
            
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

              const updatedProfile = await this.profileService.editProfileRequest(userId, data);

              if (updatedProfile) {
                res.status(200).json({
                  message: 'Profile updated successfully',
                  profile: updatedProfile
                });
              } else {
                res.status(404).json({ error: 'Profile not found' });
              }
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
