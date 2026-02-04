import { NextFunction,  Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { HttpStatus } from '../../enums/httpStatus.enums';
import { INotificationController, IPasswordController, IPaymentController, IProfileReadController, IProfileWriteController, IWalletController } from '../../interfaces/userInterfaces';
import { IUserProfileService } from '../../interfacesServices.ts/userServiceInterfaces';
import { StatusMessage } from '../../enums/statusMessage';
// import { ProfileService } from '../../services/user/profileService';


export class ProfileController implements
    IProfileReadController,
    IProfileWriteController,
    IPasswordController,
    IWalletController,
    IPaymentController,
    INotificationController {
    private _profileService: IUserProfileService;

    constructor(profileService: IUserProfileService) {
        this._profileService = profileService
    }



    getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id

            if (!userId) {
                res.status(401).json({ error: StatusMessage.UNAUTHORIZED });
                return;
            }
            const profile = await this._profileService.getProfile(userId);
            console.log(profile);

            if (profile) {
                res.status(HttpStatus.OK).json({ data: profile });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ error: StatusMessage.PROFILE_NOT_FOUND });
            }
        } catch (error) {
            // console.error('Get profile error:', error);
            next(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    };



    editProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id; 

            const data = { ...req.body }
            
            const file = req.file?.filename

            data.profileImage = file

            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: StatusMessage.UNAUTHORIZED });
                return;
            }

            const updatedProfile = await this._profileService.editProfileRequest(userId, data);

            if (updatedProfile) {
                res.status(HttpStatus.OK).json({
                    success: true,
                    message: StatusMessage.PROFILE_UPDATED,
                    profile: updatedProfile
                });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ error: StatusMessage.PROFILE_NOT_FOUND });
            }
        } catch (error) {
            // console.error('Update profile error:', error);
            next(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    };


    changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.user?.id;
            const { newPassword, oldPassword } = req.body;

            // console.log(newPassword);


            if (!id) {
                res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: StatusMessage.UNAUTHORIZED })
                return;
            }

            const result = await this._profileService.passwordChange(id, newPassword, oldPassword)
            // console.log(result);

            if (result) {
                res.status(HttpStatus.OK).json({ success: true, message: StatusMessage.PASSWORD_CHANGED })
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: StatusMessage.INCORRECT_PASSWORD })
            }
        } catch (error) {
            // console.error(error);
            next(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: StatusMessage.INTERNAL_SERVER_ERROR });
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
            const page = Number(req.params.page)
            const payment = await this._profileService.getPayment(userId as string, page)
            // console.log(payment);

            res.status(HttpStatus.OK).json({ success: true, payments: payment })

        } catch (error) {
            console.log(error);

        }
    }


    notifications = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id
            const page = Number(req.params.page)
            const noti = await this._profileService.getNotifications(userId as string , page)

            res.status(HttpStatus.OK).json({ success: true, notifications : noti?.notifications , total : noti?.total })

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


    subscriptionCheck = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.user?.id as  string

            const result = await this._profileService.subscriptionCheckRequest(id) 
            
            res.status(HttpStatus.OK).json({ result })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}
