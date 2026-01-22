import adminApi from "../../api/adminApi";

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