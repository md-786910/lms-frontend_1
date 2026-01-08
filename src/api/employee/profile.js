import axiosInstance from "../axiosInstance";

export const empProfileApi = {
  getProfile: () => {
    return axiosInstance.get(`/employee/profile/basic`);
  },
  getAddress: () => {
    return axiosInstance.get(`/employee/profile/address`);
  },
  getDocument: () => {
    return axiosInstance.get(`/employee/profile/document`);
  },
  getPersonal: () => {
    return axiosInstance.get(`/employee/profile/personal-info`);
  },
  getSalary: () => {
    return axiosInstance.get(`/employee/profile/salary`);
  },
  uploadFile: async (formData) => {
    const response = await axiosInstance.post(`/file/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  profilePic: async (updatedData) => {
    const response = await axiosInstance.put(`/employee/profile/upload-profile`, updatedData);
    return response.data;
  },
};
