import axiosInstance from './axiosInstance';

export const companyAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/company');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/company/${id}`);
    return response.data;
  },

  create: async (companyData) => {
    const response = await axiosInstance.post('/company/add', companyData);
    return response.data;
  },

  update: async (id, companyData) => {
    const response = await axiosInstance.put(`/company/${id}`, companyData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/company/${id}`);
    return response.data;
  },

  dashboard: async () => {
    const response = await axiosInstance.get(`/dashboard`);
    return response.data;
  },

};
