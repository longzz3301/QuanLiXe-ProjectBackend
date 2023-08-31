import express, { NextFunction, Request, Response } from "express";
import userModel from "../models/usermodel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// const ResetPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email } = req.body;
//   const checkUser = await userModel.findOne({ email: email });
//   if (!checkUser) {
//     throw new Error("Invalid or expired password reset token");
//   }

  // const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  // sendEmail(user.email,"Password Reset Request",{name: user.name,link: link,},"./template/requestResetPassword.handlebars");
  // return link;




// khai báo sử dụng module nodemailer
const ResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
      var transporter =  nodemailer.createTransport({ // config mail server
          service: 'Gmail',
          auth: {
              user: 'long1@gmail.com@gmail.com',
              pass: '123'
          }
      });
      var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
          from: 'Thanh Batmon',
          to: 'tomail@gmail.com',
          subject: 'Test Nodemailer',
          text: 'You recieved message from ' + req.body.email,
          html: '<p>You have got a new message</b><ul><li>Username:' + req.body.name + '</li><li>Email:' + req.body.email + '</li><li>Username:' + req.body.message + '</li></ul>'
      }
      transporter.sendMail(mainOptions, function(error:any, info : any){
          if (error) {
              console.log(error);
              res.redirect('/');
          } else {
              console.log('Message sent: ' +  info.response);
              res.redirect('/');
          }
      });
  };


   


  
  





// export default CreateAccount;
export { CreateAccount, Login , ResetPassword };
