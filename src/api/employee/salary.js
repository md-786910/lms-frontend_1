import axiosInstance from "../axiosInstance";

export const salaryAPI = {
  getSalary: () => {
    return axiosInstance.get("/employee/salary");
  },
  getSalaryHistory: async (searchTerm, sort) => {
    const response = await axiosInstance.get("/employee/salary/history");
    return response;
  },
};
