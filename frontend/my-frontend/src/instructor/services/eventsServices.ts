import instructorApi from "../../api/instructorApi";



export const getEditEvent = async (id:string) => {
    try {
        const res = await instructorApi.get(`/instructor/getEvent/${id}`);
        return res
    } catch (error) {
        console.log(error);

    }
}


export const updateEvent = async (id:string , formData:any) => {
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