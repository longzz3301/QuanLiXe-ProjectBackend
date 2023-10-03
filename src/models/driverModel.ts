import mongoose from "mongoose";
import { DriverStatus } from "../global/statusForm";

mongoose.connect("mongodb://localhost:27017/bookingcarSYSTEM");

const DriverSchema = new mongoose.Schema({
  Name_of_driver: String,
  date_of_birth: Date,
  name_of_Cars: String ,
  type_of_cars: String , 
  cars_template: String,
  phone: String,
  email: String,
  image : Buffer
  
  
});

const DriverModel = mongoose.model("drivers", DriverSchema);

export default DriverModel;
