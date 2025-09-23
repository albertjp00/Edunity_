import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../../repositories/userRepository';
import { ProfileService } from '../../services/user/profileService';
import { AuthRequest } from '../../middleware/authMiddleware';
import { HttpStatus } from '../../enums/httpStatus.enums';

export class ProfileController {
    private profileService: ProfileService;

    constructor() {
        const repo = new UserRepository();
        this.profileService = new ProfileService(repo);
    }



    getProfile = async (req: AuthRequest, res: Response, next : NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const profile = await this.profileService.getProfile(userId);
            // console.log(profile);


            if (profile) {
                res.status(200).json({ data: profile });
            } else {
                res.status(404).json({ error: 'Profile not found' });
            }
        } catch (error) {
            // console.error('Get profile error:', error);
            next(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    };



    editProfile = async (req: AuthRequest, res: Response, next : NextFunction): Promise<void> => {
        try {
            console.log('user profiel ', req.user?.id, req.file)
            const userId = req.user?.id; // Assuming `req.user` is set by auth middleware
            const updateData = req.body;


            const data = { ...req.body }
            const file = req.file?.filename

            data.profileImage = file

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const updatedProfile = await this.profileService.editProfileRequest(userId, data);

            if (updatedProfile) {
                res.status(200).json({
                    success:true,
                    message: 'Profile updated successfully',
                    profile: updatedProfile
                });
            } else {
                res.status(404).json({ error: 'Profile not found' });
            }
        } catch (error) {
            // console.error('Update profile error:', error);
            next(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    };


    changePassword = async (req: AuthRequest, res: Response, next : NextFunction): Promise<void> => {
        try {
            const id = req.user?.id;
            const { newPassword, oldPassword } = req.body;

            // console.log(newPassword);
            

            if (!id) {
                res.status(401).json({ success: false, message: "Unauthorized" })
                return;
            }

            const result = await this.profileService.passwordChange(id, newPassword, oldPassword)
            console.log(result);
            
            if (result) {
                res.json({ success: true, message: "Password updated successfully" })
            } else {
                res.status(400).json({ success: false, message: "Old password is incorrect" })
            }
        } catch (error) {
            // console.error(error);
            next(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
        }
    };
}
