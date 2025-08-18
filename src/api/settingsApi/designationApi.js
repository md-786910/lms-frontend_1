import axiosInstance from "../axiosInstance";

export const designationAPI = {
  getDesignation: async () => {
    const response = await axiosInstance.get("/designation");
    return response.data;
  },

  getDesignationById: async (id) => {
    const response = await axiosInstance.get(`/designation/${id}`);
    return response.data;
  },

  createDesignation: async (departments) => {
    const response = await axiosInstance.post("/designation", departments);
    return response.data;
  },

  updateDesignation: async (id, departments) => {
    const response = await axiosInstance.put(`/designation/${id}`, departments);
    return response.data;
  },

  deleteDesignation: async (id) => {
    const response = await axiosInstance.delete(`/designation/${id}`);
    return response.data;
  },
};
