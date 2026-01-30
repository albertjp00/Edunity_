import { MessagedStudentsDTO } from "../../dto/instructorDTO";
import { ILastMessage, IMessagedInstructor } from "../../interfaces/instructorInterfaces";
import { IMessagedUser } from "../../interfaces/userInterfaces";
import { IMessageService } from "../../interfacesServices.ts/messageServiceInterface";
import { mapMessagedStudentsDTO} from "../../mapper/instructor.mapper";
import { IInstructor } from "../../models/instructor";
import { IMessage } from "../../models/message";
import { MessageRepository } from "../../repositories/messageRepositories";




export class MessageService implements IMessageService{
    private messageRepository: MessageRepository;

    
    constructor(messageRepository: MessageRepository) {
        this.messageRepository = messageRepository
    }

    async getInstructor(instructorId:string , userId : string):Promise<IMessagedInstructor | null> {
        
        const instructor = await this.messageRepository.getInstructor(instructorId , userId )
        return instructor
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

    async getStudents(instructorId: string ): Promise<MessagedStudentsDTO[] | null> {
        try {
            const students = await this.messageRepository.getUsers(instructorId)      
            console.log('service students',students);
                  
            if(!students) return null
            return students.map(mapMessagedStudentsDTO)
        } catch (error) {
            console.log(error);
            return null
        }
    }


    // Instructor side 

    async getMessages(instructorId : string , receiverId : string):Promise<IMessage[] | null>{
        try {
            return await this.messageRepository.getUserMessages(instructorId , receiverId)
        } catch (error) {
            return null
        }
    }

    async sendInstructorMessage(instructorId:string , receiverId:string , text:string , file : string | null){
        return await this.messageRepository.sendInstructorsMessage(instructorId, receiverId , text , file)
    }
}
