import axiosInstance from "../axiosInstance";

export const departmentAPI = {
  getDepartments: async () => {
    const response = await axiosInstance.get("/department");
    return response.data;
  },

  getDepartmentsById: async (id) => {
    const response = await axiosInstance.get(`/department/${id}`);
    return response.data;
  },

  createDepartments: async (departments) => {
    const response = await axiosInstance.post("/department", departments);
    return response.data;
  },

  updateDepartments: async (id, departments) => {
    const response = await axiosInstance.put(`/department/${id}`, departments);
    return response.data;
  },

  deleteDepartments: async (id) => {
    const response = await axiosInstance.delete(`/department/${id}`);
    return response.data;
  },
};
