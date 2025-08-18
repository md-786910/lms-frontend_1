import { io } from "socket.io-client";

// Replace with your server URL
const SERVER_URL = "http://localhost:8000";

const socket = io(SERVER_URL, {
  autoConnect: false, // you can control when to connect
  reconnection: true,
  path: "/realtime",
  transports: ["websocket", "polling"],
});

export default socket;
