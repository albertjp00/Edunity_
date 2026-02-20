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



const messageRepo = new MessageRepository()
const messageService = new MessageService(messageRepo)
const messageController = new MessageController(messageService)


export const setupSocket = (io: Server) => {




  // Map of eventId -> participants
  const eventParticipants: Record<string, Participant[]> = {};
  const onlineUsers = new Map<string, string>(); // userId -> socketId


  // ----------------- Socket.IO -----------------
  io.on("connection", (socket) => {



    const userData = socket.data.user
    console.log("Client connected:", socket.id, userData);


    // ----------------- Chat -----------------


    let currentUserId: string | null = null;


    socket.on("joinRoom", ({ userId, receiverId }) => {
      const room = [userId, receiverId].sort().join("_");
      socket.join(room);
      console.log(`User ${userId} joined chat room ${room}`);

    });

    socket.on("sendMessage", (message) => {
      const { senderId, receiverId } = message;
      const room = [senderId, receiverId].sort().join("_");

      // chat window (when open)
      io.to(room).emit("receiveMessage", message);

      // sidebar / unread updates (ALWAYS)
      io.to(`user_${receiverId}`).emit("receiveMessage", message);
      io.to(`user_${senderId}`).emit("receiveMessage", message);

      //notification send
      console.log('send messages to',receiverId);
      
      
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
      console.log(`Typing received from ${senderId}, emitting to ${room}`);
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

      console.log("🟢 User online:", userId);
      io.emit("userOnline", userId);
    });

    socket.on('checkUserOnline', ({ userId }) => {
      const isOnline = onlineUsers.has(userId)
      socket.emit('userOnlineStatus', { userId, isOnline })
    })






    // ----------------- Join Event -----------------
    socket.on("joinEvent", ({ eventId, userId, role, name }) => {
      socket.join(eventId);

      if (!eventParticipants[eventId]) eventParticipants[eventId] = [];

      const participant = { socketId: socket.id, userId, role, name }; 
      eventParticipants[eventId].push(participant);

      // send all participants (including self) to the new user
      socket.emit("participants", eventParticipants[eventId]);

      // notify others about the new participant
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
    socket.on("leaveEvent", ({ eventId, userId }: { eventId: string; userId: string }) => {
      socket.leave(eventId);

      if (eventParticipants[eventId]) {
        const idx = eventParticipants[eventId].findIndex((p) => p.socketId === socket.id);
        if (idx !== -1) {
          const [leftParticipant] = eventParticipants[eventId].splice(idx, 1);
          socket.to(eventId).emit("user-left", leftParticipant);
        }
      }

      console.log(`User ${userId} left event ${eventId}`);
    });

    // ----------------- Disconnect -----------------
    socket.on("disconnect", () => {
      if (!currentUserId) return;

      onlineUsers.delete(currentUserId);
      console.log("🔴 User offline:", currentUserId);
      io.emit("userOffline", currentUserId);

      Object.keys(eventParticipants).forEach((eventId) => {
        const participants = eventParticipants[eventId];
        if (!participants) return;

        const idx = participants.findIndex((p) => p.socketId === socket.id);
        if (idx !== -1) {
          const [leftParticipant] = participants.splice(idx, 1);
          if (leftParticipant) {
            socket.to(eventId).emit("user-left", leftParticipant);
            console.log(
              `Participant ${leftParticipant.name} (${leftParticipant.userId}) disconnected from event ${eventId}`
            );
            console.log("Remaining participants:", participants.map((p) => p.name));
          }
        }
      });
    });
  });

};
