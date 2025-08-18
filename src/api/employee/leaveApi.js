import axiosInstance from "../axiosInstance";

export const employeeLeaveApi = {
  getLeave: () => {
    return axiosInstance.get("/employee/leave");
  },
  getLeaveRequest: () => {
    return axiosInstance.get("/employee/leave/leave-request");
  },
  createNewLeaveRequest: (data) => {
    return axiosInstance.post("/employee/leave/leave-request", data);
  },
  cancelLeaveRequest: (id) => {
    return axiosInstance.delete(`/employee/leave/cancel-leave-request/${id}`);
  },
};
