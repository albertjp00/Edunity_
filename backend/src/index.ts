import express from 'express';
import userRoutes from './routes/userRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { connectDB } from './utils/db.js';
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import http from 'http'
import { MessageController } from './controllers/messaage/messageController.js';


dotenv.config()


const app = express();
const PORT = 5000;

const server = http.createServer(app)

app.use(cookieParser())

// app.use(cors({
//     origin : 'http://localhost:5173',
//     methods:['GET','POST','PUT',"PATCH"]
// }))------------------------------


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});




app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));





app.use("/assets", express.static(path.join(process.cwd(), "src/assets")));



app.use(express.json());
app.use('/user', userRoutes);
app.use('/instructor', instructorRoutes)
app.use('/admin', adminRoutes)
app.use('/messages', messageRoutes);


const messageController = new MessageController()


interface Participant {
  socketId: string;
  userId: string;
  name: string;
  role: "instructor" | "user";
}

// Map of eventId -> participants
const eventParticipants: Record<string, Participant[]> = {};

// ----------------- Socket.IO -----------------
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // ----------------- Chat -----------------
  socket.on("joinRoom", ({ userId, receiverId }: { userId: string; receiverId: string }) => {
    const room = [userId, receiverId].sort().join("_");
    socket.join(room);
    console.log(`User ${userId} joined chat room ${room}`);
  });

  socket.on("sendMessage", (message: any) => {
    const room = [message.senderId, message.receiverId].sort().join("_");
    io.to(room).emit("receiveMessage", message);
  });

  // ----------------- Join Event -----------------
  socket.on("joinEvent", ({ eventId, userId, role, name }) => {
    socket.join(eventId);

    if (!eventParticipants[eventId]) eventParticipants[eventId] = [];

    const participant = { socketId: socket.id, userId, role, name }; // ✅ include name
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
    console.log("Client disconnected:", socket.id);

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



connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

