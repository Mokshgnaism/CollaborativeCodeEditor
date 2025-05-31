import User from "../models/User.js"
import Request from "../models/Request.js"

export async function sendFriendRequest(req,res){
    try {
        const {senderId,recieverId} = req.body;
        if(!senderId||!recieverId){
            return res.status(502).json({message:"either the sender is not present or reciever...."});
        }
        const sender = await User.findById(senderId);
        const reciever = await User.findById(recieverId);
        if(!reciever||!sender){
            return res.status(502).json({message:"either the sender is not present or reciever...."});
        }
        const existingRequest = await Request.find({
            $or:[
                {sender:senderId,reciever:recieverId},
                {sender:recieverId,reciever:senderId}
            ]
        })

        if(existingRequest){
            return res.status(502).json({message:"request already exists from one of the user to other"});
        }

        const newrequest = await Request.create({
            sender:senderId,
            reciever:recieverId
        })
        return res.status(200).json({message:"friend request sent",req:newrequest});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"internal server error",error:e});
    }
}

export async function acceptFriendRequest(req,res){
    try {
        









    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"internal server error",error:e});
    }
}

export async function declineFriendRequest(req,res) {
    try {
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"internal server error",error:e});
    }
}

export async function getFriendRequests(req,res){
    try {
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"internal server error",error:e});
    }
}

export async function getRoomInvitations(req,res){
    try {
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"internal server error",error:e});
    }
}