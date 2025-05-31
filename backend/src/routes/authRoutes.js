import express from "express";
import { login, logout, resetPassword, send_otp, signup, verifyEmail } from "../controllers/authController";

const router = express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/verify-email",verifyEmail);
router.post("reset-password",resetPassword);
router.post("/send-otp",send_otp);
router.post("/logout",logout);
export default router;
