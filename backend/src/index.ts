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
app.use('/instructor',instructorRoutes)
app.use('/admin',adminRoutes)
app.use('/messages', messageRoutes);


const messageController = new MessageController()


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
  socket.on("joinEvent", ({ eventId, userId, role }) => {
    socket.join(eventId);

    if (role === "instructor") {
      console.log(`🎤 Instructor ${userId} started event ${eventId}`);
      // notify all users that the event has gone live
      socket.to(eventId).emit("event-started", { eventId, instructorId: userId });
    } else {
      console.log(`👤 User ${userId} joined event ${eventId}`);
      socket.to(eventId).emit("user-joined", { userId, socketId: socket.id });
    }
  });


  // Instructor sends an offer to students
  socket.on("offer", ({ eventId, offer, from, to }) => {
    if (to) {
      io.to(to).emit("offer", { offer, from });
    } else {
      socket.to(eventId).emit("offer", { offer, from });
    }
  });



  // socket.on("markAsRead", async ({ senderId, receiverId }) => {
  //   try {
  //     // Mark messages as read in DB
  //     // await Message.updateMany(
  //     //   { senderId: receiverId, receiverId: userId, read: false },
  //     //   { $set: { read: true } }
  //     // );
  //     await messageController.markAsRead(senderId, receiverId)
      
  //     // Notify sender that their messages were read
  //     io.emit("messagesRead", { senderId });
  //   } catch (err) {
  //     console.error("Error marking messages as read:", err);
  //   }
  // });




  // Student sends answer back to instructor
  socket.on("answer", ({ eventId, answer, from, to }) => {
    if (to) {
      io.to(to).emit("answer", { answer, from });
    } else {
      socket.to(eventId).emit("answer", { answer, from });
    }
  });

  

  // ICE candidates exchange
  socket.on("ice-candidate", ({ eventId, candidate, from, to }) => {
    if (to) {
      io.to(to).emit("ice-candidate", { candidate, from });
    } else {
      socket.to(eventId).emit("ice-candidate", { candidate, from });
    }
  });


  socket.on("leaveEvent", ({ eventId, userId }) => {
    socket.leave(eventId);
    socket.to(eventId).emit("user-left", { userId });
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

