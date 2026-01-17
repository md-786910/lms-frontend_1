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
    if (token && userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
    }
  };

  // Logout clears all auth info
  const logout = async () => {
    // Always clear local state and storage first
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    try {
      await authAPI.logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
    return true;
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
