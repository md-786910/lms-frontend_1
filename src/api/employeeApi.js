import axiosInstance from "./axiosInstance";

export const employeeAPI = {
  // Create a new employee
  create: async (employeeData) => {
    const response = await axiosInstance.post(
      "/company/employee/add",
      employeeData
    );
    return { ...response.data, status: response?.status };
  },

  // Get all employees
  getAll: async (params = {}) => {
    const response = await axiosInstance.get("/company/employee", { params });
    return response.data;
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/company/employee/${id}`);
    return response.data;
  },

  // Basic Info API
  getBasicInfo: async (id) => {
    const response = await axiosInstance.get(
      `/company/employee/basic-info/${id}`
    );
    return response.data;
  },

  updateBasicInfo: async (id, updatedData) => {
    const response = await axiosInstance.put(
      `/company/employee/basic-info/${id}`,
      updatedData
    );
    return response.data;
  },

  // Address Info API
  getAddressInfo: async (id) => {
    const response = await axiosInstance.get(`/company/employee/address/${id}`);
    return response.data;
  },

  updateAddressInfo: async (id, updatedData) => {
    const response = await axiosInstance.put(
      `/company/employee/address/${id}`,
      updatedData
    );
    return response.data;
  },

  // Documents Info API
  getDocumentsInfo: async (id) => {
    const response = await axiosInstance.get(
      `/company/employee/document/${id}`
    );
    return response.data;
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

  updateDocumentsInfo: async (id, updatedData) => {
    const response = await axiosInstance.post(
      `/company/employee/document/${id}`,
      updatedData
    );
    return response.data;
  },

  deleteDocument: async (documentId, employeeId) => {
    const response = await axiosInstance.delete(
      `/company/employee/document/${documentId}/employee/${employeeId}`
    );
    return response.data;
  },

  // Personal Info API
  getPersonalInfo: async (id) => {
    const response = await axiosInstance.get(
      `/company/employee/personal-info/${id}`
    );
    return response.data;
  },

  updatePersonalInfo: async (id, updatedData) => {
    const response = await axiosInstance.put(
      `/company/employee/personal-info/${id}`,
      updatedData
    );
    return response.data;
  },

  // Salary Info API
  getSalaryInfo: async (id) => {
    const response = await axiosInstance.get(`/company/employee/salary/${id}`);
    return response.data;
  },

  updateSalaryInfo: async (id, updatedData) => {
    const response = await axiosInstance.put(
      `/company/employee/salary/${id}`,
      updatedData
    );
    return response.data;
  },

  // Delete employee
  delete: async (id) => {
    const response = await axiosInstance.delete(
      `/company/employee/suspend-employee/${id}`
    );
    return response.data;
  },
};
