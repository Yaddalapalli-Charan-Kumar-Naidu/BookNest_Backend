import mongoose from "mongoose";

const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connections successful");
    }
    catch(err){
        console.log("Error connecting DB:",err.message);
    }
}

export default dbConnect;