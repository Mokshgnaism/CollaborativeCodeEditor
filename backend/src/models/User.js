import mongoose from "mongoose";

const newUserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    friends:{
        type:[
            {
                type:mongoose.Types.ObjectId,
                ref:'User'
            }
        ],
        default:[]
    },
    isVerfifed:{
        type:Boolean,
        default:false
    }
});
const User = mongoose.model('User',newUserSchema);
export default User;


