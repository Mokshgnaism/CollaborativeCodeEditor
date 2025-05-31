import mongoose from "mongoose";
import User from "./User";
const newRequestSchema = mongoose.Schema({
    sender:{
        type:mongoose.Types.ObjectId,
        ref: 'User'
    },
    reciever:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    actionTaken:{
        type:Boolean,
        default:false
    }
});

const Request = mongoose.model('Request',newRequestSchema);
export default Request;
