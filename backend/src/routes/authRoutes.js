import express from "express";
const router = express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/verify-email");
router.post("forgot-password");
router.post("/send-otp");
