import express from "express";
import { MessageController } from "../controllers/messaage/messageController.js";


const router = express.Router();
const messageController = new MessageController();

router.post("/send", messageController.sendMessage);

router.get("/:userId/:receiverId", messageController.getChatHistory);




export default router;
