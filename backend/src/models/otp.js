import mongoose, { mongo } from "mongoose";
const newotpschema = mongoose.Schema({
    email:{
        type:String,
      required:true
    },
    hashed:{
        type:String,
        required:true
    },
    attempts:{
        type:Number,
        default:3
    }
});
const OTP = mongoose.model('OTP',newotpschema);
export default OTP