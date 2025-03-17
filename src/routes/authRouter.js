import express from 'express'
import {login,register} from '../controllers/authController.js'

const authRouter=express.Router();

authRouter.get("/",(req,res)=>{
    res.send("auth");
})
authRouter.post("/login",login);
authRouter.post("/register",register);

export default authRouter;