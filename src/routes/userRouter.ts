import express from "express";
import { CreateAccount, Login, ResetPassword } from "../controllers/userControllers";
// import { validate } from "uuid";
import userModel from "../models/usermodel";
import validate from "../middlewares/validateRequest";
import { forgotPassword } from "../controllers/authControllers";






const userRoute = express.Router();

userRoute.post("/createAccount", CreateAccount);
userRoute.post("/login", Login);

userRoute.post('/forgotpassword' , forgotPassword )
userRoute.post('/resetpassword' , ResetPassword )
export default userRoute;
