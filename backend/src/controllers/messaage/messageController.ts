import { NextFunction, Response } from "express";
import { AuthRequest, InstAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import {
  BaseMessageController, InstructorMessageController, MessageReadController,
  UserMessageController
} from "../../interfaces/messageInterfaces";
import { IMessageService } from "../../interfacesServices.ts/messageServiceInterface";
// import { MessageService } from "../../services/message/messageService";


export class MessageController implements
  BaseMessageController,
  UserMessageController,
  InstructorMessageController,
  MessageReadController {
  private messageService: IMessageService;

  constructor(messageService: IMessageService) {

    // const repo = new MessageRepository(); 
    this.messageService = messageService

  }

  getInstructor = async (req: AuthRequest, res: Response,next: NextFunction) => {
    try {
      const { instructorId } = req.params
      console.log("get instructor to message");
      const userId = req.user?.id
      const instructor = await this.messageService.getInstructor(instructorId as string, userId as string)
      console.log('get instructor to message ', instructor);
      res.status(HttpStatus.OK).json({ success: true, instructor: instructor })

    } catch (error) {
      console.log(error);
      next(error)
    }
  }


  // controller
  getInstructorToMessage = async(req: AuthRequest, res: Response,next: NextFunction) => {
    try {
      const { id } = req.params;
      const instructor = await this.messageService.getInstructorToMessage(id as string);
      if (!instructor) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Instructor not found" });
        return
      }

      res.status(HttpStatus.OK).json({
        success: true,
        instructor: {
          id: instructor._id,
          name: instructor.name,
          avatar: instructor.profileImage
        }
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch instructor" });
      next(error)
    }
  };



  getMessagedInstructors = async (req: AuthRequest, res: Response,next: NextFunction) => {
    try {
      const userId = req.user?.id!
      const result = await this.messageService.getInstructors(userId)
      console.log('get instructors ', result);
      res.status(HttpStatus.OK).json({ data: result, userId })

    } catch (error) {
      console.log(error);
      next(error)
    }
  }



  getUnreadMessages = async (req: AuthRequest, res: Response,next: NextFunction) => {
    try {
      const userId = req.user?.id!
      const { instructorId } = req.params!
      console.log('count  -----------------------');

      const result = await this.messageService.getUnreadMessages(userId, instructorId as string)
      console.log("count -------------------", result)
      res.status(HttpStatus.OK).json({ success: true, message: result })
    } catch (error) {
      console.log(error);
      next(error)
    }
  }


  sendMessage = async (req: AuthRequest, res: Response,next: NextFunction) => {
    try {
      const { receiverId, text = '' } = req.body;
      const userId = req.user?.id as string;
      // console.log("sendMessage",req.body);

      const file = req.file ? req.file.filename : null;
      console.log("file", file);


      const message = await this.messageService.sendMessage(
        userId,
        receiverId,
        text,
        file
      );

      res.status(201).json({ success: true, message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to send message" });
      next(error)
    }
  };



  getChatHistory = async (req: AuthRequest, res: Response,next: NextFunction) => {
    try {
      const { receiverId } = req.params;
      console.log("get message receiver id", receiverId);

      const userId = req.user?.id

      console.log(userId);


      const messages = await this.messageService.getChatHistory(
        userId as string,
        receiverId as string
      );

      // const updateAsRead = await this.messageService.markMessagesAsRead(userId as string, receiverId as string)



      res.status(HttpStatus.OK).json({ success: true, messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to fetch chat history" });
      next(error)
    }
  };



  //common to update messages as readd

  // markAsRead = async (senderId:string , receiverId:string) : Promise<void>=>{
  //   try {
  //     console.log('message read ', senderId , receiverId);

  //     await this.messageService.markMessagesAsRead(senderId , receiverId)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  // Instructor side -------------------------------

  getMessagedStudents = async (req: InstAuthRequest, res: Response,next: NextFunction) => {
    try {
      const instructorId = req.instructor?.id

      console.log('get messaged users ', instructorId);

      const result = await this.messageService.getStudents(instructorId as string)

      console.log(result);

      res.status(HttpStatus.OK).json({ success: true, students: result, instructorId })

    } catch (error) {
      console.log(error);
      next(error)

    }
  }



  getMessages = async (req: InstAuthRequest, res: Response,next: NextFunction) => {
    try {
      const { receiverId } = req.params;
      console.log("get message receiver id", receiverId);


      const instructorId = req.instructor?.id
      console.log('instructor id', instructorId);


      const messages = await this.messageService.getMessages(instructorId as string, receiverId as string);
      // console.log('messages ',messages);


      res.status(HttpStatus.OK).json({ success: true, messages: messages, instructorId })
    } catch (error) {
      console.log(error);
      next(error)

    }
  }


  sendInstructorMessage = async (req: InstAuthRequest, res: Response,next: NextFunction) => {
    try {

      const { text } = req.body;
      console.log('message to user ', text);

      const file = req.file ? req.file.filename : null;
      console.log(file);




      const receiverId = req.params.receiverId!
      console.log('message send instructor', receiverId);
      const instructorId = req.instructor?.id as string


      const message = await this.messageService.sendInstructorMessage(instructorId, receiverId, text, file);
      console.log('sended message ', message);



      res.status(HttpStatus.OK).json({ success: true, message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to send message" });
      next(error)
    }
  };



  markAsRead = async (senderId: string, receiverId: string) => {
    try {
      console.log('Message marked as read');

      const update = await this.messageService.markMessagesAsRead(senderId, receiverId)

    } catch (error) {
      console.log(error);

    }
  }


}
