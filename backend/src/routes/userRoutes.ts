import express from "express";
import multer from "multer";
import { AuthController } from "../controllers/user/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ProfileController } from "../controllers/user/profileController.js";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'src/assets');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();
const authController = new AuthController();
const profileController = new ProfileController();

// Auth Routes
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/verifyOtp", authController.verifyOtp);
router.post("/resendOtp", authController.resendOtp);

// Profile Routes (Protected)
router.get("/profile", authMiddleware, profileController.getProfile);
router.put("/profile",authMiddleware,upload.single("profileImage"),profileController.editProfile);



export default router;
