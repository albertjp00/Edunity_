import express from "express";
import { MessageController } from "../controllers/messaage/messageController";
import { MessageRepository } from "../repositories/messageRepositories";
import { MessageService } from "../services/message/messageService";


const router = express.Router();


const messageRepo = new MessageRepository()

const messService = new MessageService(messageRepo)
const messageController = new MessageController(messService);

router.post("/send", messageController.sendMessage);

router.get("/:userId/:receiverId", messageController.getChatHistory);




export default router;
