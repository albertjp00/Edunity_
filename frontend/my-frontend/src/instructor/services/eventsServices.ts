import instructorApi from "../../api/instructorApi";
import type { IEventFormData } from "../interterfaces/instructorInterfaces";



export const getEditEvent = async (id:string) => {
    try {
        const res = await instructorApi.get(`/instructor/getEvent/${id}`);
        return res
    } catch (error) {
        console.log(error);

    }
}


export const updateEvent = async (id:string , formData:IEventFormData) => {
    try {
        const res = await instructorApi.patch(`/instructor/event/${id}`,
            formData
        );
        return res
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const eventEnd = async (eventId:string) => {
    try {
        const res = await instructorApi.patch(`/instructor/endEvent/${eventId}`);
        return res
    } catch (error) {
        console.log(error);
        throw error
    }
}