import mongoose from 'mongoose'

export const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log("server connected successfully");
    } catch (error) {
        console.log(error.message);
    }
}