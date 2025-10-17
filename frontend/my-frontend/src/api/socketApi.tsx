import { io, Socket } from "socket.io-client";

export const connectSocket = (): Socket | null => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ No token found — skipping socket connection.");
    return null;
  }

  const socket = io(import.meta.env.VITE_API_URL, {
    auth: { token },
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: true,
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection failed:", err.message);
    if (err.message.includes("Unauthorized")) {
      // Prevent infinite loop — disconnect once, not reconnect
      socket.disconnect();
      localStorage.removeItem("token");
      // Optional: redirect after a short delay
      // setTimeout(() => window.location.href = "/user/login", 500);
    }
  });

  return socket;
};
