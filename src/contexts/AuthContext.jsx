import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/authapi/authAPI";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and token from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function used after successful API call
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  // Logout clears all auth info
  const logout = async () => {
    try {
      const resp = await authAPI.logoutUser();
      if (resp.status === 200) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // socket

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use anywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
