import { IInstructor } from "../../models/instructor.js";
import { IMessage } from "../../models/message.js";
import { MessageRepository } from "../../repositories/messageRepositories.js";

export class MessageService {
    private messageRepository: MessageRepository;

    constructor(messageRepository: MessageRepository) {
        this.messageRepository = messageRepository
    }

    async getInstructors(userId: string): Promise<IInstructor[]> {
        return await this.messageRepository.getInstructors(userId)
    }

    async sendMessage(senderId: string, receiverId: string, text: string): Promise<IMessage> {
        return await this.messageRepository.createMessage(senderId, receiverId, text);
    }



    async getChatHistory(userId: string, receiverId: string): Promise<IMessage[]> {
        return await this.messageRepository.getMessages(userId, receiverId);
    }


    async getStudents(instructorId: string) {

        return await this.messageRepository.getUsers(instructorId)
    }
}
