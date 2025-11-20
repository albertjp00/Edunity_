import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../../repositories/userRepository';
import { ProfileService } from '../../services/user/profileService';
import { AuthRequest } from '../../middleware/authMiddleware';
import { HttpStatus } from '../../enums/httpStatus.enums';
import { INotificationController, IPasswordController, IPaymentController, IProfileReadController, IProfileWriteController, IWalletController } from '../../interfaces/userInterfaces';

export class ProfileController implements 
        IProfileReadController,
        IProfileWriteController,
        IPasswordController,
        IWalletController,
        IPaymentController,
        INotificationController {
    private _profileService: ProfileService;

    constructor(profileService: ProfileService) {
        // const repo = new UserRepository(); 
        this._profileService = profileService
    }



    getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const profile = await this._profileService.getProfile(userId);
            // console.log(profile);
            

            if (profile) {
                res.status(HttpStatus.OK).json({ data: profile });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ error: 'Profile not found' });
            }
        } catch (error) {
            // console.error('Get profile error:', error);
            next(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    };



    editProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log('user profiel ', req.user?.id, req.file)
            const userId = req.user?.id; // Assuming `req.user` is set by auth middleware
            const updateData = req.body;

            const data = { ...req.body }
            const file = req.file?.filename

            data.profileImage = file

            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
                return;
            }

            const updatedProfile = await this._profileService.editProfileRequest(userId, data);

            if (updatedProfile) {
                res.status(HttpStatus.OK).json({
                    success: true,
                    message: 'Profile updated successfully',
                    profile: updatedProfile
                });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ error: 'Profile not found' });
            }
        } catch (error) {
            // console.error('Update profile error:', error);
            next(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    };


    changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.user?.id;
            const { newPassword, oldPassword } = req.body;

            // console.log(newPassword);


            if (!id) {
                res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" })
                return;
            }

            const result = await this._profileService.passwordChange(id, newPassword, oldPassword)
            console.log(result);

            if (result) {
                res.status(HttpStatus.OK).json({ success: true, message: "Password updated successfully" })
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Old password is incorrect" })
            }
        } catch (error) {
            // console.error(error);
            next(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
        }
    };


    getWallet = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id
            const wallet = await this._profileService.getWallet(userId as string)
            res.status(HttpStatus.OK).json({ success: true, wallet })

        } catch (error) {
            console.log(error);

        }
    }

    getPayment = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id
            const payment = await this._profileService.getPayment(userId as string)
            console.log(payment);

            res.status(HttpStatus.OK).json({ success: true, payments: payment })

        } catch (error) {
            console.log(error);

        }
    }


    notifications = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id
            const notifications = await this._profileService.getNotifications(userId as string)

            res.status(HttpStatus.OK).json({ success: true, notifications })

        } catch (error) {
            console.log(error);

        }
    }

    notificationsMarkRead = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id
            const notifications = await this._profileService.notificationsMarkRead(userId as string)

            res.status(HttpStatus.OK).json({ success: true, notifications })

        } catch (error) {
            console.log(error);

        }
    }
}
