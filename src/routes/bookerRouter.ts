import express from "express";
import {
  BookingCar,
  GetBookedForm,
  GetCancelForm,
  GetInfoDriver,
  GetStatics,
  GetWaitingForm,
  getCompleteForm,
  getFormByDateCreateForm,
  getFormByDay,
  getFormHistory,
  getInfoUser,
} from "../controllers/bookerControllers";

import { CheckRoleBooker, CheckToken } from "../middlewares/authorization";
import { GetListFormApproved } from "../controllers/operatorControllers";
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

bookerRoute.get(
  "/getInfoDriver/:id",
  CheckToken,
  CheckRoleBooker,
  GetInfoDriver
);


// bookerRoute.get("/getListFormApproved", CheckToken, CheckRoleBooker, GetListFormApproved);

bookerRoute.get("/getCancelForm", CheckToken, CheckRoleBooker, GetCancelForm);
bookerRoute.get("/getBookedForm", CheckToken, CheckRoleBooker, GetBookedForm);
bookerRoute.post("/getFormByDay", CheckToken, CheckRoleBooker, getFormByDay);
bookerRoute.post("/getFormByDateCreateForm", CheckToken, CheckRoleBooker, getFormByDateCreateForm);
bookerRoute.get("/getFormWaiting", CheckToken, CheckRoleBooker, GetWaitingForm);

bookerRoute.get("/getStactics" , CheckToken, CheckRoleBooker ,GetStatics)
export default bookerRoute;
