import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL_DEV } from "../config/api";

const SOCKET_URL = `${API_BASE_URL_DEV}`;
// const SOCKET_URL =import.meta.env.VITE_API_BASE_URL;

const SocketContext = createContext({});

const genUserId = (role, id) => {
  if (role === "employee") {
    return `employee_${id}`;
  } else if (role === "admin") {
    return `admin_${id}`;
  } else if (role === "light_admin") {
    return `light_admin_${id}`;
  }
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [updateDashboard, setUpdateDashboard] = useState(Math.random());
  const connectSocket = (token) => {
    if (!socket) {
      const decoded = jwtDecode(token);
      const userId = genUserId(decoded?.sub?.role, decoded?.sub?.id);
      const s = io(SOCKET_URL, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket", "polling"],
        path: "/realtime",
        query: {
          userId,
          companyId: decoded?.sub?.company_id,
        },
      });

      // Connection events
      s.on("connect", () => {
        console.log("✅ Socket connected:", s.id);
        setSocket(s); // Set socket when connection is established
      });

      s.on("disconnect", (reason) => {
        console.warn("⚠️ Socket disconnected:", reason);
      });

      s.on("connect_error", (err) => {
        console.log({ err });
        console.error("❌ Socket error:", err.message);
      });

      s.connect();
      return s;
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
    }
  };

  // Restore connection if token exists (e.g., after refresh)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !socket) {
      const s = connectSocket(token);
      setSocket(s);
    }
    // Handle cleanup and socket disconnect when component unmounts
    return () => {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, []);

  // update dashboard on socket connection

  const value = useMemo(
    () => ({
      socket,
      connectSocket,
      disconnectSocket,
      setUpdateDashboard,
      updateDashboard,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket, updateDashboard]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within SocketProvider");
  }
  return context;
};
