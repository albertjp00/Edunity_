import express from 'express';
import userRoutes from './routes/userRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { connectDB } from './utils/db.js';
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path';
import cookieParser from 'cookie-parser';


dotenv.config()


const app = express();
const PORT = 5000;

app.use(cookieParser())

// app.use(cors({
//     origin : 'http://localhost:5173',
//     methods:['GET','POST','PUT',"PATCH"]
// }))
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



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
