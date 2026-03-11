import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/authapi/authAPI";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.warn("Token expired, logging out...");
          handleAutomaticLogout();
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error decoding token:", error);
        handleAutomaticLogout();
        return false;
      }
    }
    return false;
  };

  const handleAutomaticLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // We don't necessarily need to redirect here if axios interceptor handles it,
    // but it's safer to have it here too if no API call is made.
    if (window.location.pathname !== "/login") {
      // window.location.href = "/login";
    }
  };

  // Load user and token from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      if (checkTokenExpiration()) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);

    // Set up an interval to check token expiration every minute
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => clearInterval(interval);
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
    try {
      const resp = await authAPI.logoutUser();
      if (resp.status === 200) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, we should clear local session
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return true;
    }
  };

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
