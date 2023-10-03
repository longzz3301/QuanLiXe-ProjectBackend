import express from "express";
import { CheckRoleApprover, CheckToken  } from "../middlewares/authorization";
import {
  AppovedForm,
  CancelForm,
  GetHistoryApprover,
  GetListFormApproved,
  GetListFormCancel,

  GetlistFormWait,

  GetlistFormWaitbyDay,
  UpdateDistanceForm
  
} from "../controllers/approverControllers";
// import { StacticsDriver } from "../controllers/operatorControllers";

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
  "/getForm",
  CheckToken,
  CheckRoleApprover,
  GetHistoryApprover
);


ApproverRoute.get(
  "/getFormForApprover",
  CheckToken,
  CheckRoleApprover,
  GetHistoryApprover
);

ApproverRoute.get(
  "/GetListFormCancelApprover",
  CheckToken,
  CheckRoleApprover,
  GetListFormCancel
);

ApproverRoute.get(
  "/ListFormApproved",
  CheckToken,
  CheckRoleApprover,
  GetListFormApproved
);

ApproverRoute.post(
  "/getListFormWait",
  CheckToken,
  CheckRoleApprover,
  GetlistFormWaitbyDay
);

ApproverRoute.get(
  "/WaitForm",
  CheckToken,
  CheckRoleApprover,
  GetlistFormWait
);




ApproverRoute.put('/updateDistanceForm/:id' , CheckToken, CheckRoleApprover ,UpdateDistanceForm )

export default ApproverRoute;
