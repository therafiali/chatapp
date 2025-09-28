// utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    if (typeof window !== "undefined") {
      socket = io("http://localhost:3001", {
        autoConnect: false,
        auth: {
          token: localStorage.getItem("accessToken"),
        },
      });

      // 🔑 reconnect automatically on reload
      socket.on("connect_error", (err) => {
        console.error("Socket connect error:", err.message);
      });
    }
  }

  // Always make sure socket is connected
  if (socket && !socket.connected) {
    socket.connect();
  }

  return socket;
};
