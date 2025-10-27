import { ILastMessage, IMessagedInstructor } from "../../interfaces/instructorInterfaces.js";
import { IInstructor } from "../../models/instructor.js";
import { IMessage } from "../../models/message.js";
import { MessageRepository } from "../../repositories/messageRepositories.js";




export class MessageService {
    private messageRepository: MessageRepository;

    
    constructor(messageRepository: MessageRepository) {
        this.messageRepository = messageRepository
    }

    async getInstructor(instructorId:string , userId : string):Promise<IMessagedInstructor | null> {
        // const instructors = (inst) =>{

        // }
        return await this.messageRepository.getInstructor(instructorId , userId )
    }

    async getInstructorToMessage(instructorId : string):Promise<IInstructor | null>{
        return await this.messageRepository.getInstructorOnly(instructorId )
    }

    async getInstructors(userId: string): Promise<IMessagedInstructor[] > {
        return await this.messageRepository.getInstructors(userId)
    }

    async getUnreadMessages(userId:string , instructorId:string) : Promise<ILastMessage | null>{
        return await this.messageRepository.getUnreadMessages(userId , instructorId)
    }

    async sendMessage(senderId: string, receiverId: string, text: string , file: string | null): Promise<IMessage> {
        return await this.messageRepository.createMessage(senderId, receiverId, text , file);
    }



    async getChatHistory(userId: string, receiverId: string): Promise<IMessage[]> {
        return await this.messageRepository.getMessages(userId, receiverId);
    }

    async   markMessagesAsRead(senderId: string, receiverId: string): Promise<boolean> {
        console.log('repository',senderId , receiverId);
        
        return await this.messageRepository.markAsRead(senderId, receiverId);
    }

    async getStudents(instructorId: string ) {

        return await this.messageRepository.getUsers(instructorId)
    }


    // Instructor side 

    async getMessages(instructorId : string , receiverId : string):Promise<IMessage[]>{
        return await this.messageRepository.getUserMessages(instructorId , receiverId)
    }

    async sendInstructorMessage(instructorId:string , receiverId:string , text:string , file : string | null){
        return await this.messageRepository.sendInstructorsMessage(instructorId, receiverId , text , file)
    }
}
