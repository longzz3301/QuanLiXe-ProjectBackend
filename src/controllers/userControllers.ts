import express, { NextFunction, Request, Response } from "express";
import userModel from "../models/usermodel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const crypto = require('crypto');

var nodemailer =  require('nodemailer')

import { Obj, RequestMiddleware } from "../global/interface";
import getRoleOffice from "../global/roleOffice";
import GetRoleOffice from "../global/roleOffice";
import { emit } from "process";
import { test } from "node:test";
import { error } from "console";

const CreateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username, phone, date_of_birth, officeCode } =
      req.body;

      const emailRegex = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (
      email == "" ||
      password == "" ||
      phone == "" ||
      date_of_birth == "" ||
      officeCode == "" ||
      username == ""
    ) {
      res.json({
        status: "FAILED",
        message: "Empty input field",
      });
     

      } 
      
      else if (!emailRegex.test(email)) { 
        res.json({
          status : "FAILED" ,
          message: "Invalid email"
        })
      }  else if (!new Date(date_of_birth).getTime()) {
        res.json({
          status: " failed" ,
          message:" invalid date"
        })
    }

    const checkUserExist = await userModel.findOne({
      $or: [
        { email: email },
        // {phone:phone} ,
        // {username:username}
      ],
    });
    if (checkUserExist) {
      res.send("user da ton tai");
      next();
    } else {
      const salt = bcrypt.genSaltSync(8);
      const hassPassword = bcrypt.hashSync(password, salt);
      const user = await userModel.create({
        username: username,
        email: email,
        password: hassPassword,
        phone: phone,
        date_of_birth: new Date(date_of_birth),
        role: getRoleOffice[officeCode as "B" | "O" | "A" | "D"],
      });

      res.send("create Succes");
    }
  } catch (error) {
    res.send(error);
  }
};

const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const checkUser = await userModel.findOne({ email: email });
    console.log("checkUserLogin" , checkUser);
    const checkPassword = bcrypt.compareSync(password, checkUser.password);
    if (checkPassword && checkUser) {
      const token = jwt.sign(
        {
          email: checkUser.email,
          UserId: checkUser.id,
          role: checkUser.role,
        },
        "longzz"
      );
      res.send({ token });
    } else {
      res.send("wrong password or username not");
    }
  } catch (error) {
    res.send(error);
  }
};



 const ForgotPassword = async (
   req: Request,
   res: Response,
   next: NextFunction
 ) => {
  const EMAIL_ADDRESS = 'duylonggz@gmail.com';
  const EMAIL_PASSWORD = 'long3301';
  

    
    const {email} = req.body
    const checkEmail = await userModel.findOne({email:email})
    if (!checkEmail) {
      res.send('user does not exits')
    }else {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: "EMAIL_ADDRESS",
          pass: "EMAIL_PASSWORD",
        },

        
      });
      function generateOTP() {
        
        const otp = crypto.randomBytes(3).toString('hex').toUpperCase();

        console.log('OTP:', otp);

        return otp
        
            
        // setTimeout(() => {
        //   console.log('OTP đã hết hạn sau 60 giây.');
        //   generateOTP(); 
        // }, 60000); 
      }
      
      
      
      const otp = generateOTP()

      const saveOtp = await userModel.findOneAndUpdate({email:email } , {otp:otp})
      


       const mailOptions = {
         from: EMAIL_ADDRESS,
         to: email,
         subject: 'OTP Verification',
         text: `Your OTP is: ${otp}`,
       };

      
       await  transporter.sendMail(mailOptions)
      res.send("success")
    ;
      
    }
 }

const ResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {otp, password} = req.body
  const salt = bcrypt.genSaltSync(8);
  const hassPassword = bcrypt.hashSync(password, salt);
  const checkOtp = await userModel.findOne({otp:otp})
  console.log("checkOtp", checkOtp)
  if (otp) {
     
    const ResetPassword =await userModel.findOneAndUpdate({otp:otp} , {password:hassPassword})
  }
  res.send('oke')
}


   


  
  





// export default CreateAccount;
export { CreateAccount, Login , ResetPassword , ForgotPassword};
