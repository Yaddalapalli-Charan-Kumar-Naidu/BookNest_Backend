import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';

import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
dotenv.config();
const app=express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 


dbConnect();

app.use("/api/auth",authRouter);

app.use('/books', bookRouter);

app.get("/",(req,res)=>{
    res.status(200).send("Server is running");
})


const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`server running at http:localhost:${PORT}`);
})

