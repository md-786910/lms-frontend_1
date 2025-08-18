import { useEffect } from "react";
import socket from "../utility/socket";

const useSocket = ({ userId, companyId, onEvents = {} }) => {
  useEffect(() => {
    // Connect socket
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);

      // Register user and join company room
      if (userId) socket.emit("registerUser", userId);
      if (companyId) socket.emit("joinCompany", companyId);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("error", (err) => {
      console.error("⚠️ Socket error:", err);
    });

    // Custom events
    for (const [eventName, handler] of Object.entries(onEvents)) {
      socket.on(eventName, handler);
    }

    // Cleanup
    return () => {
      socket.disconnect();
      for (const eventName of Object.keys(onEvents)) {
        socket.off(eventName);
      }
    };
  }, [userId, companyId]);
};

export default useSocket;
