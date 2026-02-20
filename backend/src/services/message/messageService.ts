import { MessagedStudentsDTO } from "../../dto/instructorDTO";
import { MessageDTO } from "../../dto/userDTO";
import { ILastMessage, IMessagedInstructor } from "../../interfaces/instructorInterfaces";
import { IMessageService } from "../../interfacesServices.ts/messageServiceInterface";
import { mapMessagedStudentsDTO, mapMessageToDTO} from "../../mapper/instructor.mapper";
import { IInstructor } from "../../models/instructor";
import { IMessage } from "../../models/message";
import { IMessageRepository } from "../../repositories/messageRepositories";




export class MessageService implements IMessageService{
    private _messageRepository: IMessageRepository;

    
    constructor(messageRepository: IMessageRepository) {
        this._messageRepository = messageRepository
    }

    async getInstructor(instructorId:string , userId : string):Promise<IMessagedInstructor | null> {
        
        const instructor = await this._messageRepository.getInstructor(instructorId , userId )
        return instructor
    }

    async getInstructorToMessage(instructorId : string):Promise<IInstructor | null>{
        return await this._messageRepository.getInstructorOnly(instructorId )
    }

    async getInstructors(userId: string): Promise<IMessagedInstructor[] > {
        return await this._messageRepository.getInstructors(userId)
    }

    async getUnreadMessages(userId:string , instructorId:string) : Promise<ILastMessage | null>{
        return await this._messageRepository.getUnreadMessages(userId , instructorId)
    }

    async sendMessage(senderId: string, receiverId: string, text: string , file: string | null): Promise<IMessage | null> {
        try {
            return await this._messageRepository.createMessage(senderId, receiverId, text , file);
        } catch (error) {
            console.log(error);
            return null
        }
    }



    async getChatHistory(userId: string, receiverId: string): Promise<MessageDTO[]> {
        const messages =  await this._messageRepository.getMessages(userId, receiverId);
        return messages.map(mapMessageToDTO)
    }

    async   markMessagesAsRead(senderId: string, receiverId: string): Promise<boolean> {
        console.log('repository',senderId , receiverId);
        
        return await this._messageRepository.markAsRead(senderId, receiverId);
    }


        // Instructor side 
    async getStudents(instructorId: string ): Promise<MessagedStudentsDTO[] | null> {
        try {
            const students = await this._messageRepository.getUsers(instructorId)      
            console.log('service students',students);
                  
            if(!students) return null
            return students.map(mapMessagedStudentsDTO)
        } catch (error) {
            console.log(error);
            return null
        }
    }




    async getMessages(instructorId : string , receiverId : string):Promise<MessageDTO[] | null>{
        try {
            const messages = await this._messageRepository.getUserMessages(instructorId , receiverId)
            console.log(messages);
            return messages.map(mapMessageToDTO)

        } catch (error) {
            console.log(error);
            
            return null
        }
    }

    async sendInstructorMessage(instructorId:string , receiverId:string , text:string , file : string | null):Promise<IMessage>{
        return await this._messageRepository.sendInstructorsMessage(instructorId, receiverId , text , file)
    }
}
