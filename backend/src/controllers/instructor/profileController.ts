import { Request, Response } from 'express';
import { AuthRequest, InstAuthRequest } from '../../middleware/authMiddleware.js';
import { InstructorRepository } from '../../repositories/instructorRepository.js';
import { InstructorProfileService } from '../../services/instructor/profileServices.js';
import { loadavg } from 'os';

export class InstProfileController {
    private profileService: InstructorProfileService;

    constructor() {
        const repo = new InstructorRepository();
        this.profileService = new InstructorProfileService(repo);
    }



    getProfile = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.instructor?.id
            console.log('instructor get profile ');


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
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };



    editProfile = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            console.log('user profile ', req.instructor?.id, req.file)
            const userId = req.instructor?.id; // Assuming `req.user` is set by auth middleware
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
                    success: true, message: 'Profile updated successfully',
                    profile: updatedProfile
                })
            } else {
                res.status(404).json({ error: 'Profile not found' })
            }
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };


    changePassword = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.instructor?.id;
            const { newPassword, oldPassword } = req.body;

            if (!id) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            const result = await this.profileService.passwordChange(id, newPassword, oldPassword);

            if (result) {
                res.json({ success: true, message: "Password updated successfully" });
            } else {
                res.status(403).json({ success: false, message: "Old password is incorrect" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    };

}
