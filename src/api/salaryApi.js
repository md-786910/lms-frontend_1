import axiosInstance from "./axiosInstance";

export const salaryAPI = {
  importCurrentSalaryManually: async (data) => {
    const response = await axiosInstance.post(
      "/company/salary/import-current-salary",
      data
    );
    return response;
  },
  getDashboard: () => {
    return axiosInstance.get("/company/salary/dashboard");
  },
  getSalaryHistory: async (searchTerm, sort) => {
    const response = await axiosInstance.get("/company/salary", {
      params: { search: searchTerm, ...sort },
    });
    return response;
  },
  generateSalary: async (data) => {
    const response = await axiosInstance.post(
      "/company/salary/generate-salary",
      data
    );
    return response;
  },
};
