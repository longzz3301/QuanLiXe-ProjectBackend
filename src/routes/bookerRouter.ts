import express from "express";
import {
  BookingCar,
  GetBookedForm,
  GetCancelForm,
  GetStatics,
  GetWaitingForm,
  getCompleteForm,
  getFormByDay,
  getFormHistory,
  getInfoUser,
} from "../controllers/bookerControllers";

import { CheckRoleBooker, CheckToken } from "../middlewares/authorization";
const bookerRoute = express.Router();

bookerRoute.post("/bookingCar", CheckToken, CheckRoleBooker, BookingCar);

bookerRoute.get("/getform", CheckToken, CheckRoleBooker, getFormHistory);

bookerRoute.get("/getProfile", CheckToken, getInfoUser);

bookerRoute.get(
  "/getCompleteForm",
  CheckToken,
  CheckRoleBooker,
  getCompleteForm
);
bookerRoute.get("/getCancelForm", CheckToken, CheckRoleBooker, GetCancelForm);
bookerRoute.get("/getBookedForm", CheckToken, CheckRoleBooker, GetBookedForm);
bookerRoute.post("/getFormByDay", CheckToken, CheckRoleBooker, getFormByDay);
bookerRoute.get("/getFormWaiting", CheckToken, CheckRoleBooker, GetWaitingForm);
bookerRoute.get("/getStactics" , CheckToken, CheckRoleBooker ,GetStatics)
export default bookerRoute;
