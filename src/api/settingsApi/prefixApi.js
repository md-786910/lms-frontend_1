import axiosInstance from "../axiosInstance";

export const prefixAPI = {
  getPrefixes: async () => {
    const response = await axiosInstance.get("/prefix");
    return response.data;
  },

  getPrefixById: async (id) => {
    const response = await axiosInstance.get(`/prefix/${id}`);
    return response.data;
  },

  createPrefix: async (prefixData) => {
    const response = await axiosInstance.post("/prefix", prefixData);
    return response.data;
  },

  updatePrefix: async (id, prefixData) => {
    const response = await axiosInstance.put(`/prefix/${id}`, prefixData);
    return response.data;
  },

  deletePrefix: async (id) => {
    const response = await axiosInstance.delete(`/prefix/${id}`);
    return response.data;
  },
};
