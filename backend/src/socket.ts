import { Server } from "socket.io";
import { MessageController } from "./controllers/messaage/messageController.js";
import { MessageRepository } from "./repositories/messageRepositories.js";
import { MessageService } from "./services/message/messageService.js";
// import { socketAuthMiddleware } from "./middleware/authMiddleware.js";

interface Participant {
  socketId: string;
  userId: string;
  name: string;
  role: "instructor" | "user";
}

const messageRepo = new MessageRepository();
const messageService = new MessageService(messageRepo);
const messageController = new MessageController(messageService);

export const setupSocket = (io: Server) => {
  // Map of eventId -> participants
  const eventParticipants: Record<string, Participant[]> = {};
  const onlineUsers = new Map<string, string>(); // userId -> socketId

  // ----------------- Socket.IO -----------------
  io.on("connection", (socket) => {
    const userData = socket.data.user;

    // ----------------- Chat -----------------

    let currentUserId: string | null = null;

    socket.on("joinRoom", ({ userId, receiverId }) => {
      const room = [userId, receiverId].sort().join("_");
      socket.join(room);
    });

    socket.on("sendMessage", (message) => {
      const { senderId, receiverId } = message;
      const room = [senderId, receiverId].sort().join("_");

      io.to(room).emit("receiveMessage", message);

      io.to(`user_${receiverId}`).emit("receiveMessage", message);
      io.to(`user_${senderId}`).emit("receiveMessage", message);

      io.to(`user_${receiverId}`).emit("messageNotification", {
        senderId,
      });
    });

    // socket.on("sendMessage", (message) => {
    //   const { senderId, receiverId } = message;

    // });

    socket.on("messagesRead", async ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("_");
      await messageController.markAsRead(senderId, receiverId);
      io.to(room).emit("messagesReadUpdate", { senderId, receiverId });
    });

    //typing
    socket.on("typing", ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("_");
      io.to(room).emit("userTyping", { senderId });
    });

    //stop typing
    socket.on("stopTyping", ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("_");
      io.to(room).emit("userStopTyping", { senderId });
    });

    socket.on("joinPersonalRoom", ({ userId }) => {
      if (!userId) return;

      currentUserId = userId;

      onlineUsers.set(userId, socket.id);
      socket.join(`user_${userId}`);

      io.emit("userOnline", userId);
    });

    socket.on("checkUserOnline", ({ userId }) => {
      const isOnline = onlineUsers.has(userId);
      socket.emit("userOnlineStatus", { userId, isOnline });
    });

    // ----------------- Join Event -----------------
    // store participants
    const eventParticipants: Record<string, any[]> = {};

    socket.on("joinEvent", ({ eventId, userId, role, name }) => {
      socket.join(eventId);

      if (!eventParticipants[eventId]) eventParticipants[eventId] = [];

      const participant = {
        socketId: socket.id,
        userId,
        role,
        name,
      };

      eventParticipants[eventId].push(participant);

      // send existing users to new user
      socket.emit("participants", eventParticipants[eventId]);

      // notify others
      socket.to(eventId).emit("user-joined", participant);
    });

    // ----------------- WebRTC Signaling -----------------
    socket.on("offer", ({ eventId, offer, from, to }: any) => {
      if (to) io.to(to).emit("offer", { offer, from });
      else socket.to(eventId).emit("offer", { offer, from });
    });

    socket.on("answer", ({ eventId, answer, from, to }: any) => {
      if (to) io.to(to).emit("answer", { answer, from });
      else socket.to(eventId).emit("answer", { answer, from });
    });

    socket.on("ice-candidate", ({ eventId, candidate, from, to }: any) => {
      if (to) io.to(to).emit("ice-candidate", { candidate, from });
      else socket.to(eventId).emit("ice-candidate", { candidate, from });
    });

    // ----------------- Mic / Cam Status -----------------
    socket.on("update-status", ({ eventId, micOn, camOn }: any) => {
      socket.to(eventId).emit("status-updated", {
        socketId: socket.id,
        micOn,
        camOn,
      });
    });

    // ----------------- Leave Event -----------------
    socket.on("leaveEvent", ({ eventId }) => {
      socket.leave(eventId);

      const list = eventParticipants[eventId];
      if (!list) return;

      const index = list.findIndex((p) => p.socketId === socket.id);

      if (index !== -1) {
        const [left] = list.splice(index, 1);
        socket.to(eventId).emit("user-left", left);
      }
    });

    // ----------------- Disconnect -----------------
    socket.on("disconnect", () => {
      if (!currentUserId) return;

      onlineUsers.delete(currentUserId);
      io.emit("userOffline", currentUserId);

      Object.keys(eventParticipants).forEach((eventId) => {
        const list = eventParticipants[eventId];

        if(!list) return

        const index = list.findIndex((p) => p.socketId === socket.id);

        if (index !== -1) {
          const [left] = list.splice(index, 1);
          socket.to(eventId).emit("user-left", left);
        }
      });
    });
  });
};
