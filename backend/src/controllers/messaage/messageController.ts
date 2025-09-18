import { Request, Response } from "express";
import { MessageService } from "../../services/message/messageService.js";
import { MessageRepository } from "../../repositories/messageRepositories.js";
import { AuthRequest, InstAuthRequest } from "../../middleware/authMiddleware.js";

export class MessageController {
  private messageService: MessageService;

  constructor() {
    const repo = new MessageRepository();
    this.messageService = new MessageService(repo)
  }

  getInstructor = async (req:AuthRequest , res:Response) =>{
    try {
      const {instructorId} = req.params 

      const instructor = await this.messageService.getInstructor(instructorId as string)
      console.log('get instructor to message ',instructor);
      res.json({success:true , instructor : instructor})
      
    } catch (error) {
      console.log(error);
      
    }
  }

  getMessagedInstructors = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id!
      const result = await this.messageService.getInstructors(userId) 
      console.log('get instructors ', result);
      res.json({ instructors: result , userId })

    } catch (error) {
      console.log(error);

    }
  }

  sendMessage = async (req: AuthRequest, res: Response) => {
    try {
      const { receiverId, text } = req.body;
      console.log('message send ', receiverId);
      const userId = req.user?.id as string

      const message = await this.messageService.sendMessage(userId, receiverId, text);

      res.status(201).json({ success: true, message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to send message" });
    }
  };

  getChatHistory = async (req: AuthRequest, res: Response) => {
    try {
      const { receiverId } = req.params;
      console.log("get message receiver id", receiverId);

      const userId = req.user?.id
      console.log(userId);


      const messages = await this.messageService.getChatHistory(
        userId as string,
        receiverId as string
      );



      res.json({ success: true, messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to fetch chat history" });
    }
  };



  // Instructor side 
  getMessagedStudents = async (req: InstAuthRequest, res: Response) => {
    try {
      const instructorId = req.instructor?.id
   
      console.log('get messaged users ', instructorId);

      const result = await this.messageService.getStudents(instructorId )
      console.log(result);

      res.json({ success: true, students: result  , instructorId})

    } catch (error) {
      console.log(error);

    }
  }

  getMessages = async (req:InstAuthRequest , res : Response) => {
    try {
      const { receiverId } = req.params;
      console.log("get message receiver id", receiverId);
      

      const instructorId = req.instructor?.id
      console.log('instructor id',instructorId  );


      const messages = await this.messageService.getMessages(instructorId as string,receiverId as string);
      console.log('messages ',messages);
      

      res.json({success:true , messages : messages  , instructorId})
    } catch (error) {
      console.log(error);

    }
  }


  sendInstructorMessage = async (req: InstAuthRequest, res: Response) => {
    try {
      const {  text } = req.body;
      const receiverId = req.params.receiverId!
      console.log('message send instructor', receiverId); 
      const instructorId = req.instructor?.id as string

      const message = await this.messageService.sendInstructorMessage(instructorId, receiverId, text);
      console.log('sended message ',message);
      
      

      res.json({ success: true, message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to send message" });
    }
  };


}
