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
  profilePic: async (id, updatedData) => {
    const response = await axiosInstance.put(
      `/company/employee/profile/${id}`,
      updatedData
    );
    return response.data;
  },
};
