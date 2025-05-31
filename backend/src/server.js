import express from "express";
import {dbConnect} from "./config/dbConnect.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
dotenv.config();
dbConnect();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})
