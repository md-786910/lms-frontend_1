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
};
