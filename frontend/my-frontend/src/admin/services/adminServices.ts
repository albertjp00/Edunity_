import adminApi from "../../api/adminApi";
import type { LoginFormData } from "../adminInterfaces";









export const adminLogin = async (value :LoginFormData) => {
    try {
        const response = await adminApi.post("/admin/login", value);
        return response
    } catch (error) {
        console.error('Error fetching instructor profile:', error);
    }
};



export const getUsers = async (queryParams: URLSearchParams) => {
  try {
    const res = await adminApi.get(`/admin/getUsers?${queryParams.toString()}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};



// export const blockUser = async (userId: string) => {
//   const res = await adminApi.put(`/admin/block-user/${userId}`);
//   return res.data;
// };


export const unblockUser = async (userId: string) => {
  console.log("unblock");
  
  const res = await adminApi.put(`/admin/blockUser/${userId}`);
  return res;
};


export const blockUser = async (userId: string) => {
  const res = await adminApi.put(`/admin/blockUser/${userId}`);
  return res;
};


export const blockInstructor = async (instructorId: string) => {
  const res = await adminApi.put(`/admin/blockInstructor/${instructorId}`);
  return res;
};




//earnings 

export const getEarnings= async (page = 1)=>{
  const res = await adminApi.get(`/admin/getEarnings/${page}`)
  return res
}

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


export const blockCourse = async (id:string) => {
  try {
    const res = await adminApi.get(`/admin/blockCourse/${id}`)
    return res; 
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    throw error;
  }
};




export const viewCourseDetails = async (id:string)=>{
    try {
        const res = await adminApi.get(`/admin/courseDetails/${id}`)
    
    return res
    } catch (error) {
        console.log(error);
        
    }
}


export const toggleBlockUserApi = (userId: string,blocked: boolean) => {
  const res =  adminApi.put(`/admin/blockUser/${userId}`, {
    blocked,
  });
  return res
};


export const getStats = async() => {
  const res =  await adminApi.get("/admin/stats");
  return res
};

export const getOverview = async() => {
  const res =  await adminApi.get('/admin/userOverview')
  return res
};



export const getKyc = async(id:string) => {
  const res =  await adminApi.get(`/admin/getKyc/${id}`)
  return res
};

export const KycVerify = async(instructorId:string) => {
  const res =  await adminApi.put(`/admin/verifyKyc/${instructorId}`)
  return res
};

export const KycReject = async(instructorId:string , selectedReason : string) => {
  const res =  await adminApi.put(`/admin/rejectKyc/${instructorId}`,
        { reason: selectedReason }
      )
  return res
};


export const getPurchases = async(search :string , page:number) => {
  const res =  await adminApi.get(`/admin/purchases?search=${search}&page=${page}`);
  return res
};


// adminApi.get<InstructorsResponse>(`/admin/getInstructors?page=${currentPage}&search=${search}`);
export const getInstructorsData = async(search :string , currentPage:number) => {
  const res =  await adminApi.get(`/admin/getInstructors?page=${currentPage}&search=${search}`);
  return res
};

export const exportData = async() => {
  const res =  await adminApi.get(`/admin/exportPdf`,{
    responseType:'blob'
  });
  return res
};

export const fetchCategory = async() => {
  const res =  await adminApi.get(`/admin/getCategories`);
  return res
};


export const addCategory = async(category:string , skills : string[]) => {
  const res =  await adminApi.post(`/admin/addCategory`,{
    category,
    skills
  });
  return res
};



export const deleteCategory = async(category:string) => {
  const res =  await adminApi.patch(`/admin/deleteCategory`,{
    category
  });
  return res
};



export const getReports = async() => {
  const res =  await adminApi.get(`/admin/getReports`);
  return res
};