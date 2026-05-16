import express from "express"
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import dotenv from 'dotenv'
import authRoutes from "./routes/authRoutes.js"
import moneyRoutes from "./routes/moneyRoutes.js"
import cors from "cors"
import plaidRoutes from "./routes/plaid.routes.js"
import server from "./routes/borrowings.route.js";
// import groupRoutes from "../src/routes/groupRoutes.js"
const app=express();
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Google DNS
dotenv.config();


app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth", authRoutes);
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials:true
}));

app.use('/api/plaid',plaidRoutes);
app.use('/auth',authRoutes);
app.use('/money',moneyRoutes);
app.use('/borrowings',server);
// app.use('/group',groupRoutes);

app.listen(5001,()=>{
    console.log("server is started on 5001");
    connectDB();
});