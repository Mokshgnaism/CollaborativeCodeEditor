import mongoose  from "mongoose";
async function dbconnect(){
try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    if(connect){
        console.log(connect.host);
        console.log(connect.name);
    }else{
        console.error(`error connecting to db`);
        process.exit(1);
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}
}
export {dbconnect}