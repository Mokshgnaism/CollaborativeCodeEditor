import mongoose, { mongo } from "mongoose";
import User from "./User.js"
const newRoomSchema = mongoose.Schema({

    creator:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    members:{
        type:[
            {
                type:mongoose.Types.ObjectId,
                ref:'User'
            }
        ],
        default:[]
    }
});

newRoomSchema.pre('save',function (next){
    if(!this.members.includes(this.creator)){
        this.members.push(this.creator);
    }
    next();
})



const Room = mongoose.model('Room',newRoomSchema);
export default Room;