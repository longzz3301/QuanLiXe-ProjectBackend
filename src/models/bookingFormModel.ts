import mongoose from "mongoose";
import { Obj } from "../global/interface";

import { FormStatus } from "../global/statusForm";
import { number } from "yup";
import { string } from "joi";

mongoose.connect("mongodb://localhost:27017/bookingcarSYSTEM");

const formBookingSchema = new mongoose.Schema({
  //BookerId
  start_time: Date,
  end_time: Date,
  start_location: String,
  end_location: String,

  status: { type: String, default: FormStatus.WAIT.toString() },
  number_people: Number,
  reason: String,
  userId: String,
  driverId:String ,
  create_at: Date ,
  codeForm : String , 
  calculateDistance:Number ,
  calculateTime:Number ,
  cancelReason : String

});

const bookingFormModel = mongoose.model("formbooking", formBookingSchema);

export default bookingFormModel;
