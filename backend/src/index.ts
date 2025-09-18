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


dotenv.config()


const app = express();
const PORT = 5000;

const server = http.createServer(app)

app.use(cookieParser())

// app.use(cors({
//     origin : 'http://localhost:5173',
//     methods:['GET','POST','PUT',"PATCH"]
// }))


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
app.use('/instructor',instructorRoutes)
app.use('/admin',adminRoutes)
app.use('/messages', messageRoutes);


io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // 📩 Chat Rooms
  socket.on("joinRoom", ({ userId, receiverId }) => {
    const room = [userId, receiverId].sort().join("_");
    socket.join(room);
  });

  socket.on("sendMessage", (message) => {
    const room = [message.senderId, message.receiverId].sort().join("_");
    io.to(room).emit("receiveMessage", message);
  });

  // 🎥 Live Session (Events)
  socket.on("joinEvent", ({ eventId, userId }) => {
    socket.join(eventId);
    console.log(`${userId} joined event ${eventId}`);
    socket.to(eventId).emit("user-joined", { userId });
  });

  // Instructor sends an offer
  socket.on("offer", ({ eventId, offer, from }) => {
    socket.to(eventId).emit("offer", { offer, from });
  });

  // Student replies with an answer
  socket.on("answer", ({ eventId, answer, from }) => {
    socket.to(eventId).emit("answer", { answer, from });
  });

  // Exchange ICE candidates
  socket.on("ice-candidate", ({ eventId, candidate, from }) => {
    socket.to(eventId).emit("ice-candidate", { candidate, from });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});





connectDB().then(() => {
  server.listen(PORT, () => {   
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

