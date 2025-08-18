import axiosInstance from "../axiosInstance";

export const leaveAPI = {
  getleave: async () => {
    const response = await axiosInstance.get("/setting/leave");
    return response.data;
  },

  getleaveById: async (id) => {
    const response = await axiosInstance.get(`/setting/leave${id}`);
    return response.data;
  },

  createleave: async (leaveTypes) => {
    const response = await axiosInstance.post("/setting/leave", leaveTypes);
    return response.data;
  },

  updateleave: async (id, leaveTypes) => {
    const response = await axiosInstance.put(`/setting/leave${id}`, leaveTypes);
    return response.data;
  },

  deleteleave: async (id) => {
    const response = await axiosInstance.delete(`/setting/leave${id}`);
    return response.data;
  },
};
