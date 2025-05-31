import mongoose from "mongoose";
import Room from "./Room.js";
const codeSchema = mongoose.Schema({
    room:{
        type:mongoose.Types.ObjectId,
        ref:'Room'
    },
    code:{
        type:String,
        default:""
    },
    language:{
        type:String,
        default:"cpp"
    }
});
const Code = mongoose.model('Code',codeSchema);
export default Code;