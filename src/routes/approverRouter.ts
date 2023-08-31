import express from "express";
import { CheckRoleApprover, CheckToken  } from "../middlewares/authorization";
import {
  AppovedForm,
  CancelForm,
  GetHistoryApprover,
  GetlistFormWait,
  UpdateDistanceForm
  
} from "../controllers/approverControllers";

const ApproverRoute = express.Router();

ApproverRoute.put(
  "/approvedStatus/:id",
  CheckToken,
  CheckRoleApprover,
  AppovedForm
);
ApproverRoute.patch(
  "/cancelStatus/:id",
  CheckToken,
  CheckRoleApprover,
  CancelForm
);
// ApproverRoute.get(
//   "/getListWait",
//   CheckToken,
//   CheckRoleApprover,
//   GetlistFormWait
// );

ApproverRoute.get(
  "/getFormForApprover",
  CheckToken,
  CheckRoleApprover,
  GetHistoryApprover
);

ApproverRoute.get(
  "/getListFormWait",
  CheckToken,
  CheckRoleApprover,
  GetlistFormWait
);

ApproverRoute.put('/updateDistanceForm/:id' , CheckToken, CheckRoleApprover ,UpdateDistanceForm )

export default ApproverRoute;
