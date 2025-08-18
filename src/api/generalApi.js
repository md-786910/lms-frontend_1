import axiosInstance from './axiosInstance';

export const generalAPI = {
  getDepartments: async () => {
    const response = await axiosInstance.get('/setting/department');
    return response.data;
  },

  getDesignations: async () => {
    const response = await axiosInstance.get('/setting/designation');
    return response.data;
  }
};
