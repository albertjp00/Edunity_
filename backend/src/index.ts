import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./utils/db";
import userRoutes from "./routes/userRoutes";
import instructorRoutes from "./routes/instructorRoutes";
import adminRoutes from "./routes/adminRoutes";
import messageRoutes from "./routes/messageRoutes";
import { setupSocket } from "./socket"; 
import { errorHandler } from "./middleware/errorMiddleware";
// import { socketAuthMiddleware } from "./middleware/authMiddleware";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());




app.use(
  cors({
    // origin: 'https://spoke-indices-questions-announcement.trycloudflare.com',
    
    origin: [process.env.FRONTEND_URL].filter(Boolean) as string[],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/assets", express.static(path.join(process.cwd(), "src/assets")));

app.use("/user", userRoutes);
app.use("/instructor", instructorRoutes);
app.use("/admin", adminRoutes);
app.use("/messages", messageRoutes);


// ✅ Initialize socket.io
const io = new Server(server, {
  
  cors: {
    origin: [
    
    process.env.FRONTEND_URL,
    //  'https://spoke-indices-questions-announcement.trycloudflare.com'
  ].filter(Boolean) as string[],

    credentials: true,
  },
  
});



setupSocket(io); // ✅ attach all socket handlers

// io.use(socketAuthMiddleware)

app.use(errorHandler)


connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});












