import axiosInstance from "../axiosInstance";

export const leaveApi = {

  getAllLeave: async (id) => {
    const response = await axiosInstance.get(`/company/employee/leave/${id}`);
    return response.data;
  },
  updateLeave: async (id,data) => {
    const response = await axiosInstance.put(`/company/employee/leave/${id}`, data);
    return response.data;
  },

};
