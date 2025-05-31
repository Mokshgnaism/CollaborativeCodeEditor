import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import OTP from "../models/otp";
import mongoose from "mongoose";

  const emailUser =process.env.GMAIL ;
  const emailPass = process.env.GMAIL_PASSWORD;

   const transporter = nodemailer.createTransport({
    service:gmail,
    auth:{
        user:process.env.GMAIL,
        pass:process.env.GMAIL_PASSWORD
    }
   });

async function sendEmail(to,{subject,text,html}){
 try {
    const sent = await transporter.sendMail({
        from: `"COLLAB" <${emailUser}> `,
        to,
        subject,
        text,
        html
    }
    )
    if(sent){
        return true;
    }else{
        return false;
    }
 } catch (e) {
    console.error("internal server error",e);
 }
}


const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.MODE === "production",
    sameSite: "lax", 
    maxAge: 7 * 24 * 60 * 60 * 1000 
}
export async function signup(req,res){
    try {
        const {email,password,name} = req.body;
        if(!email||!password||!name){
            return res.status(500).json({message:"all are not filled"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(403).json({message:"email exissts bro ..."});
        }
        const hashedPassword = await bcrypt.hash(password,12);
        const newUser = await User.create({
            email,
            password:hashedPassword,
            name
        });
        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn:"3d"});
        res.cookie("jwt",token,COOKIE_OPTIONS);
        return res.status(200).json({message:"user created",USER:newUser});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"internal server error"});
    }
}

export async function login(req,res){
    try {
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({message:"fill all the fields"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"no user found"});
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(403).json({message:"wrong credentials"});
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});
        res.cookie("jwt",cookie,COOKIE_OPTIONS);
        return res.status(200).json({message:"user logged in",USER:user});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"internal server error"});
    }
}

export async function logout(req,res){
    try {
        res.clearCookie("jwt",COOKIE_OPTIONS);
        return res.status(200).json({message:"logged out"});
    } catch (e) {
         console.log(e);
        return res.status(500).json({message:"internal server error"});
    }
}

export async function send_otp(req,res){
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"no user found"});
        }
        const plain = Math.floor(100000+Math.random()*900000);
        const hashed = await bcrypt.hash(plain,13);
        const newotp = await OTP.create({
            email,
            hashed
        })
        const otpSent  = await sendEmail(email,{
            subject:"YOUR COLLAB OTP",
            text:plain.toString(),
            html:`<h1>${plain.toString()}</h1>`
        })
       if(otpSent){
        return res.status(200).json({message:"done sending"});
       }else{
        res.status(400).json({message:"error sending otp"});
       }
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"internal server error"});
    }
}

export async function verifyEmail(req,res){
    try {
        const {email,otp} = req.body;
        const existingOtp = await OTP.findOne({email});
        if(!existingOtp){
            return res.status(400).json({message:"no otp exists for the email try sending another"});
        }
        
        if(existingOtp.attempts<0||existingOtp.expiresAt<Date.now()){
           await  OTP.findByIdAndDelete(existingOtp._id);
            return res.status(403).json({message:"please send new otp . this otp is expired due to overatttempting"})
        }
        
        const hashed = existingOtp.hashed;
        const match = await bcrypt.compare(otp,hashed);
        if(!match){
            await OTP.findByIdAndUpdate(existingOtp._id,{
                $inc:{attempts:-1}
            })
            return res.status(400).json({message:"wrong otp"});
        }
        const user = await User.findOne({email});
        await User.findByIdAndUpdate(user._id,{
            isVerified:true
        })
        return res.status(200).json({message:"logged in "});        
    } catch (e) {
         console.log(e);
        return res.status(500).json({message:"internal server error"});
    }
}




export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const record = await OTP.findOne({ email });
    if (record && record.expiresAt < Date.now()) {
      await OTP.findByIdAndDelete(record._id);
      return res.status(400).json({ success: false, message: 'OTP expired or not found.' });
    }
    if (record.attempts <= 0) {
      await OTP.findByIdAndDelete(record._id);
      return res.status(502).json({ message: "your attempts per this otp are over please try to resend using logging in again" });
      
    }
    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found.' });
    }

    const match = await bcrypt.compare(otp, record.hashed);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    await OTP.findByIdAndDelete(record._id);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, { expiresIn:"3d"});
    res.cookie('jwt', token, COOKIE_OPTIONS);
    return res.json({ success: true, message: 'Password reset successful.' });
  }
   catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error', error });
  }
}




