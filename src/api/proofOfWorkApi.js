import axiosInstance from "./axiosInstance";

export const proofOfWorkApi = {
  uploadEvidence: (formData) => {
    return axiosInstance.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  createSubmission: (data) => {
    return axiosInstance.post("/employee/proof-of-work", data);
  },
  getMySubmissions: () => {
    return axiosInstance.get("/employee/proof-of-work");
  },
  getMySubmissionById: (id) => {
    return axiosInstance.get(`/employee/proof-of-work/${id}`);
  },
  getEmployeeSubmissions: (employeeId) => {
    return axiosInstance.get(`/company/proof-of-work/employee/${employeeId}`);
  },
  approveSubmission: (id, data = {}) => {
    return axiosInstance.post(`/company/proof-of-work/${id}/approve`, data);
  },
  rejectSubmission: (id, data) => {
    return axiosInstance.post(`/company/proof-of-work/${id}/reject`, data);
  },
};
