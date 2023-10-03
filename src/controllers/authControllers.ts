import { NextFunction ,Request,Response } from "express";
import userModel from "../models/usermodel";

import jwt from "jsonwebtoken"
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const forgotPassword = async(req: Request,
//     res: Response,
//     next: NextFunction) => {
//         const {email } = req.body
//         const user = await userModel.findOne({ email:email });

//     if (!user) {
//         res.send({ error: 'User not found' });
//     }
//     const token = jwt.sign({ id: user._id }, "longzz",);
//     user.passwordResetToken = token;
//     // await userModel.save({token})

//     const resetUrl = `http://${req.headers.host}/auth/reset-password?token=${token}`;
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: 'Password Reset Request',
//         html: `
//         <p>You requested a password reset. Click the link below to reset your password:</p>
//         <a href="${resetUrl}">${resetUrl}</a>
//       `,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.json({ message: 'Password reset email sent' });
//     } catch
//     (err) {
//         console.error('Failed to send password reset email:', err);
//         res.status(500).json({ error: 'Failed to send password reset email' });
//     }

//     }


//     const ResetPassword = async(req: Request,
//         res: Response,
//         next: NextFunction) => {
    
//         }

// module.exports = {
//   forgotPassword,
//   ResetPassword,
// };


