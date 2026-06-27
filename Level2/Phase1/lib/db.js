import mongoose from "mongoose";

async function connectDB() {
    try{
       await mongoose.connect(process.env.MONGO_URI)
       console.log("db connected successfully")
    }catch(e){
        console.log("Error in DB connection : ", e)
    }
}

export default connectDB;