import axiosInstance from "../axiosInstance";

export const leaveApi = {
  getDashboard: () => {
    return axiosInstance.get("/company/leave/dashboard");
  },

  getLeaveRequest: (searchTerm, sort) => {
    console.log({ searchTerm, sort });
    return axiosInstance.get("/company/leave", {
      params: { search: searchTerm, ...sort },
    });
  },
  leaveRejected: (
    id,
    employee_id,
    rejected_reason = "Your leave request has been rejected due to operational requirements. Please contact HR for details"
  ) => {
    return axiosInstance.post(
      `/company/leave/reject/${id}/employee/${employee_id}`,
      { rejected_reason }
    );
  },
  leaveApproved: (id, employee_id) => {
    return axiosInstance.post(
      `/company/leave/approve/${id}/employee/${employee_id}`
    );
  },
};
