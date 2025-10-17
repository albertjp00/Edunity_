import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { setupSocket } from "./socket.js"; 
import { errorHandler } from "./middleware/errorMiddleware.js";
import { socketAuthMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 5000;

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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

app.use(errorHandler)

// ✅ Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});


setupSocket(io); // ✅ attach all socket handlers

io.use(socketAuthMiddleware)

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});












