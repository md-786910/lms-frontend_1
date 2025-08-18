import axiosInstance from "../axiosInstance";

export const EmpDashboardApi = {
  getDashboard: () => {
    return axiosInstance.get("/employee/dashboard");
  },
  getProfileBasicInfo: () => {
    return axiosInstance.get("/employee/profile/basic");
  },
};
