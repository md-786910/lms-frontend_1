import axiosInstance from "../axiosInstance";

export const currencyAPI = {
  getCurrencies: async () => {
    const response = await axiosInstance.get("/currency");
    return response.data;
  },

  getCurrencyById: async (id) => {
    const response = await axiosInstance.get(`/currency/${id}`);
    return response.data;
  },

  createCurrency: async (currencyData) => {
    const response = await axiosInstance.post("/currency", currencyData);
    return response.data;
  },

  updateCurrency: async (id, currencyData) => {
    const response = await axiosInstance.put(`/currency/${id}`, currencyData);
    return response.data;
  },

  deleteCurrency: async (id) => {
    const response = await axiosInstance.delete(`/currency/${id}`);
    return response.data;
  },
};
