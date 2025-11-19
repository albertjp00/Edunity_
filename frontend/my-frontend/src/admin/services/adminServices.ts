import adminApi from "../../api/adminApi";


export const getProfile = async (id: string) => {
    try {
        const response = await adminApi.get(`/admin/instructors/${id}`);
        return response
    } catch (error) {
        console.error('Error fetching instructor profile:', error);
    }
};


export const getCourses = async (id: string) => {
    try {
        const response = await adminApi.get(`/admin/instructorsCourses/${id}`);
        return response
    } catch (error) {
        console.error('Error fetching instructor profile:', error);
    }
};


//   to get user details
export const getUserDetails = async (id: string) => {
    try {
        const response = await adminApi.get(`/admin/user/${id}`);
        return response
    } catch (error) {
        console.error('Error fetching instructor profile:', error);
    }
};


export const getUserCourses = async (id: string) => {
    try {
        const response = await adminApi.get(`/admin/userCourses/${id}`);
        return response
    } catch (error) {
        console.error('Error fetching instructor profile:', error);
    }
};



//courses 

// /src/services/adminServices.ts
export const getAdminCourses = async (page: number,search : string ,  limit: number) => {
  try {
    const res = await adminApi.get(`/admin/courses?page=${page}&search=${search}&limit=${limit}`);
    return res; 
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    throw error;
  }
};
