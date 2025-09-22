import adminApi from "../../api/adminApi";

export const getUsers = async (queryParams: URLSearchParams) => {
  try {
    const res = await adminApi.get(`/admin/getUsers?${queryParams.toString()}`);
    return res.data;
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
  return res.data;
};


export const blockUser = async (userId: string) => {
  const res = await adminApi.put(`/admin/blockUser/${userId}`);
  return res.data;
};