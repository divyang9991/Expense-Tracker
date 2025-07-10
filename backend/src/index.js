import express from "express"
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import dotenv from 'dotenv'
import authRoutes from "./routes/authRoutes.js"
import moneyRoutes from "./routes/moneyRoutes.js"
import cors from "cors"
const app=express();

dotenv.config();

app.use(cookieParser());

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials:true
}));

app.use('/auth',authRoutes);
app.use('/money',moneyRoutes);

app.listen(5001,()=>{
    console.log("server is started on 5001");
    connectDB();
});