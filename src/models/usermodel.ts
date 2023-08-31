const mongoose = require("mongoose");
import Joi from "joi" 


interface User {
  username: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  officeCode: string;
  role: string;
  // resetLink : {
  //   data:string ,
  //   default: ''
  // }
}

mongoose.connect("mongodb://localhost:27017/bookingcarSYSTEM");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone: Number,
  date_of_birth: Date,
  office: String,
  role: String,
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
  // resetLink : {
  //   data: String ,
  //   default:''
  // }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
