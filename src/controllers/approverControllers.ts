import { NextFunction, Request, Response } from "express";
import bookingFormModel from "../models/bookingFormModel";
import { FormStatus } from "../global/statusForm";
import { RequestMiddleware } from "../global/interface";
import { LocationService } from "../utils/aws.location";

const GetlistFormWait = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const listWaitApprove = await bookingFormModel.find({
    status: FormStatus.WAIT,
  });
  res.send({
    total: listWaitApprove.length ,
    data: listWaitApprove
  });
};

const GetHistoryApprover = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getStatus = req.query.status;
  const condition: any = {
    status: { $nin:[ FormStatus.BOOKED.toString() , FormStatus.WAIT.toString() ] },
  };
 
  const getForm = await bookingFormModel.find(condition);
  res.send({
    total: getForm.length,
    data: getForm,
  });
};

const AppovedForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const FormId = req.params.id;
  const updateStatus = FormStatus.APPROVED;
  const checkForm = await bookingFormModel.findById(FormId);
  console.log(checkForm);
  const opratorName = req.userId;
  const checkDistance = checkForm?.calculateDistance 
  const checktime =checkForm?.calculateTime
  if (checkForm && checkDistance && checktime) {
    // const oprator = await bookingFormModel.create({})
    const ApprovedStatus = await bookingFormModel.findByIdAndUpdate(
      { _id: FormId },
      { status: updateStatus }
    );
    res.send([
      ['approve success ' , checkForm]
    ] );
  } else {
    res.send("not found Form");
  }
};

const CancelForm = async (req: Request, res: Response, next: NextFunction) => {
  const FormId = req.params.id;
  const updateStatus = FormStatus.CANCEL;
  const checkForm = await bookingFormModel.findById(FormId);
  console.log(checkForm);
  if (checkForm) {
    const CancelStatus = await bookingFormModel.findByIdAndUpdate(
      { _id: FormId },
      { status: updateStatus }
    );
    res.send("cancel success");
  } else {
    res.send("not found Form");
  }
};

  const UpdateDistanceForm = async (req: Request, res: Response, next: NextFunction) => {
    const {start_location , end_location, } = req.body 
    const IdForm = req.params.id 
    const locationService = new LocationService();
  const startLocation = await locationService.searchLocationByText(
    start_location
  );
  // console.log("START: ", startLocation)

  const endLocation = await locationService.searchLocationByText(end_location);
  // console.log("END: ", endLocation)

  // console.log("data" ,locationService.searchLocationByPosition )
  const startLong1 = endLocation.Summary.ResultBBox?.at(0);
  const startLong2 = endLocation.Summary.ResultBBox?.at(1);



  console.log("startLong1", startLong1);
  console.log("startLong1", startLong2);

  const EndLong1 = startLocation.Summary.ResultBBox?.at(0);
  const EndLong2 = startLocation.Summary.ResultBBox?.at(1);

  console.log("EndLong1", EndLong1);
  console.log("EndLong2", EndLong2);

  const calculateRouteMatrix = await locationService.calculateRoute(startLong1 || 0,startLong2 || 0,EndLong1 || 0,EndLong2 ||0)

  console.log(calculateRouteMatrix)
  const calculateDistance = calculateRouteMatrix.Summary.Distance 
  const calculateTime = calculateRouteMatrix.Summary.DurationSeconds
  console.log("estimated distane :" , calculateDistance)
  console.log(" estimated time: " ,calculateTime)

  const checkForm = await bookingFormModel.findById(IdForm) 
  
  if (checkForm) {
    const updateTimeAndDistanceForm = await bookingFormModel.findByIdAndUpdate({_id:checkForm.id} , {calculateDistance:calculateDistance ,calculateTime:calculateTime })

    res.send(updateTimeAndDistanceForm)

  }

  
  }

  

export { AppovedForm, CancelForm, GetHistoryApprover , GetlistFormWait , UpdateDistanceForm};
