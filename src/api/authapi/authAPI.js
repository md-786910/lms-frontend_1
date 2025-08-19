import axiosInstance from "../axiosInstance";

export const authAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post("/user/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/user/forgot-password", email);
    return response.data;
  },

  resetPassword: async (passwordData) => {
    const response = await axiosInstance.post(
      "/user/reset-password",
      passwordData
    );
    return response.data;
  },
  addNewUser: async (userData) => {
    const response = await axiosInstance.post("/user/add-new-user", userData);
    return response;
  },
  getNewUser: async () => {
    const response = await axiosInstance.get("/user/new-user");
    return response;
  },

  logoutUser: async () => {
    const response = await axiosInstance.post("/user/logout");
    return response;
  },

  getNotification: async () => {
    const response = await axiosInstance.get(`employee/notify/employee`);
    return response.data;
  },
  readNotification: async (id) => {
    const response = await axiosInstance.get(`employee/notify/read/${id}`);
    return response.data;
  },
};

export const userAPI = {
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put("/user/profile", profileData);
    return response.data;
  },

  setNewPassword: async (passwordData) => {
    const response = await axiosInstance.post(
      "/user/verify-email",
      passwordData
    );
    return response.data;
  },
};
