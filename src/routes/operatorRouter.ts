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
  UpdateFormComplete,
  getAllListDriver,
  GetListFormApproved,
  getTotalCar,
  getTotalFormComplete,
  // getKmForm,
  GetListFormBooked,
  GetListFormCancel,
  GetListFormComplete,
  getStaticDriver,
  getBestDriver,
  // StacticsDriver,
  
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

OperatorRoute.get(
  "/getStaticDriver",
  CheckToken,
  CheckRoleOperator,
  getStaticDriver
)

OperatorRoute.get(
  "/GetListFormBooked",
  CheckToken,
  CheckRoleOperator,
  GetListFormBooked
)


OperatorRoute.get(
  "/GetListFormCancel",
  CheckToken,
  CheckRoleOperator,
  GetListFormCancel
)

OperatorRoute.get(
  "/getBestDriver",
  CheckToken,
  CheckRoleOperator,
  getBestDriver
)

OperatorRoute.get(
  "/GetListFormComplete",
  CheckToken,
  CheckRoleOperator,
  GetListFormComplete
)



OperatorRoute.delete(
  "/deleteDriver",
  CheckToken,
  CheckRoleOperator,
  DeleteDriver
);



OperatorRoute.post(
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

OperatorRoute.get("/getListFormHistory", CheckToken, CheckRoleOperator, GetListFormApproved);



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
  UpdateFormComplete
);

// OperatorRoute.get("/getInfor", CheckToken, CheckRoleOperator, GetListFormHistory);

OperatorRoute.put(
  "/updateDrivers",
  CheckToken,
  CheckRoleOperator,
  UpdateDrivers
);



// OperatorRoute.get(
//   "/StacticsDriver",
//   CheckToken,
//   CheckRoleOperator,
//   // StacticsDriver
// );






// OperatorRoute.get("/getAllDriver" , CheckToken, CheckRoleOperator , AllDriver)

OperatorRoute.get("/getDriversIdForm", CheckToken, CheckRoleOperator,getDriversIdForm );

OperatorRoute.post("/getListFormApproved", CheckToken, CheckRoleOperator,GetListFormApproved );

OperatorRoute.get("/getTotalCar", CheckToken, CheckRoleOperator,getTotalCar )

OperatorRoute.get("/getTotalFormComplete", CheckToken, CheckRoleOperator,getTotalFormComplete )

// OperatorRoute.get("/getKmForm", CheckToken, CheckRoleOperator,getKmForm )
export default OperatorRoute;
