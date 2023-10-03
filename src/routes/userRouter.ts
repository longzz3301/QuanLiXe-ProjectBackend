import express from "express";
import { CreateAccount, ForgotPassword, Login, ResetPassword } from "../controllers/userControllers";
// import { validate } from "uuid";
import userModel from "../models/usermodel";
import validate from "../middlewares/validateRequest";







const userRoute = express.Router();

userRoute.post("/createAccount", CreateAccount);
userRoute.post("/login", Login);

userRoute.post('/forgotpassword' , ForgotPassword )
userRoute.post('/resetpassword'  , ResetPassword  )
export default userRoute;
