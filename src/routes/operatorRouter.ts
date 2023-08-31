import express from "express";
import { CheckRoleApprover, CheckRoleOperator, CheckToken } from "../middlewares/authorization";
import {
  
  CreateDriver,

  DeleteDriver,
  AddCarsAndDriversForm,
  
  GetListDriversAndCarsReady,
  

  UpdateDrivers,
  GetListFormHistory,
  getDriversIdForm,
  CompleteForm,
  getAllListDriver,
  
} from "../controllers/operatorControllers";

const OperatorRoute = express.Router();


OperatorRoute.post(
  "/createDrivers",
  CheckToken,
  CheckRoleOperator,
  CreateDriver
);

OperatorRoute.get(
  "/getListDriver",
  CheckToken,
  CheckRoleOperator,
  getAllListDriver
)


OperatorRoute.delete(
  "/deleteDriver",
  CheckToken,
  CheckRoleOperator,
  DeleteDriver
);



OperatorRoute.get(
  "/getListDriversAndCarsReady",
  CheckToken,
  CheckRoleOperator,
  GetListDriversAndCarsReady
);



OperatorRoute.put(
  "/addCarsForm/:id",
  CheckToken,
  CheckRoleOperator,
  AddCarsAndDriversForm
);





OperatorRoute.get("/getListFormHistory", CheckToken, CheckRoleOperator, GetListFormHistory);
OperatorRoute.put(
  "/updateDrivers/:id",
  CheckToken,
  CheckRoleOperator,
  UpdateDrivers
);

OperatorRoute.put(
  "/updateStatusComplete/:id",
  CheckToken,
  CheckRoleOperator,
  CompleteForm
);

// OperatorRoute.get("/getInfor", CheckToken, CheckRoleOperator, GetListFormHistory);





// OperatorRoute.get("/getAllDriver" , CheckToken, CheckRoleOperator , AllDriver)

OperatorRoute.get("/getDriversIdForm", CheckToken, CheckRoleOperator,getDriversIdForm );

export default OperatorRoute;
