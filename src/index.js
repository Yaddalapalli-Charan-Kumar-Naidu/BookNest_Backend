import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';

import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import { startCronJob } from "./utils/cron.js";
dotenv.config();
const app=express();

startCronJob();
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '10mb' })); // or higher
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static('uploads')); 


dbConnect();

app.use("/api/auth",authRouter);

app.use('/api/books', bookRouter);

app.get("/",(req,res)=>{
    res.status(200).send("Server is running");
})


const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`server running at http:localhost:${PORT}`);
})

