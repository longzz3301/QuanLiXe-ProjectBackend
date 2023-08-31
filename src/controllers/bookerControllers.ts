import express, { NextFunction, Request, Response, request } from "express";
import bookingFormModel from "../models/bookingFormModel";
import { FormStatus } from "../global/statusForm";
import { RequestMiddleware } from "../global/interface";
import { LocationService } from "../utils/aws.location";
import userModel from "../models/usermodel";
import moment from "moment";

const BookingCar = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const {
    start_time,
    end_time,
    start_location,
    end_location,
    number_people,
    reason,
  } = req.body;

  const createForm = await bookingFormModel.create({
    start_time: new Date(start_time),
    end_time: new Date(end_time),
    start_location: start_location,
    end_location: end_location,
    status: FormStatus.WAIT.toString(),
    number_people: number_people,
    reason: reason,
    userId: req.userId,
    create_at: moment(),
    // calculateDistance:calculateDistance ,
    // calculateTime:calculateTime
  });
  res.send(createForm);
};

const getFormByDay = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    // {
    //   status: FormStatus.WAIT.toString(),
    //   start_time: {
    //     $gt: new Date(req.body.start),
    //   },
    //   end_time: {
    //     $lt: new Date(req.body.end),
    //   },
    // }
    const condition: any = {
      userId: userId,
      status: FormStatus.WAIT,
    };
    if (req.body.start) {
      condition.start_time = {
        $gt: new Date(req.body.start),
      };
    }
    if (req.body.end) {
      condition.end_time = {
        $lt: new Date(req.body.end),
      };
    }

    const listWaitByDay = await bookingFormModel.find(condition);
    // if (listWaitByDay === null) {
    //   const condition: any = {
    //     userId: userId,
    //     status: FormStatus.WAIT,
    //   };
    //   const getWaitingForm = await bookingFormModel.find(condition);

    res.send({
      total: listWaitByDay.length,
      data: listWaitByDay,
    });
    // } else {
    //   res.send(listWaitByDay);
    // }
  } catch (error) {
    console.log("ERR: ", error);
    res.send(error);
  }
};

const getFormHistory = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getUserId = req.userId;
  const condition: any = {
    userId: getUserId,
  };

  const getFormUser = await bookingFormModel.find(condition);
  res.send({
    total: getFormUser.length,
    data: getFormUser,
  });
};

const getCompleteForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  // const CompleteStatus = req.query.status

  const userId = req.userId;

  const condition: any = {
    userId: userId,
    status: FormStatus.COMPLETE,
  };
  const getCompleteForm = await bookingFormModel.find(condition);

  res.send({
    total: getCompleteForm.length,
    data: getCompleteForm,
  });
};

const GetCancelForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const statusForm = FormStatus.CANCEL;

  const condition: any = {
    userId: userId,
    status: statusForm,
  };
  const GetCancelForm = await bookingFormModel.find(condition);
  console.log(GetCancelForm);

  res.send({
    total: GetCancelForm.length,
    data: GetCancelForm,
  });
};

const GetWaitingForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  // const CompleteStatus = req.query.status

  const userId = req.userId;

  const condition: any = {
    userId: userId,
    status: FormStatus.WAIT,
  };
  const getWaitingForm = await bookingFormModel.find(condition);

  res.send({
    total: getCompleteForm.length,
    data: getCompleteForm,
  });
};

const GetBookedForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  // const CompleteStatus = req.query.status

  const userId = req.userId;

  const condition: any = {
    userId: userId,
    status: FormStatus.BOOKED,
  };
  const getBookedForm = await bookingFormModel.find(condition);

  res.send({
    total: getBookedForm.length,
    data: getBookedForm,
  });
};

const getInfoUser = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getUser = req.user;
  const getRole = req.role;
  console.log(getUser);

  const getProfile = await userModel.findOne(getUser);
  console.log(getProfile);
  res.send(getProfile);
};

const GetStatics = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    // const januaryData = await bookingFormModel.find({
    //   userId: userId,
    //   status: FormStatus.COMPLETE,
    //   $or: [
    //     {
    //       end_time: {
    //         $gte: new Date(1672531200000),
    //       },
    //     },
    //     {
    //       end_time: {
    //         $lt: new Date(1675209600000),
    //       },
    //     },
    //   ],
    // });
    const now = new Date()
    const startOfJan = new Date(now.getFullYear(), 0, 1)
    const endOfJan = new Date(now.getFullYear(), 1, 1)
    // console.log("currentYear: ", now.getFullYear())
    // console.log("startOfJan: ", startOfJan)
    // console.log("endOfJan: ", endOfJan)
    const januaryData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfJan ,
        // $gte: new Date(1672531200000),
        $lt: endOfJan,
        // $lt: new Date(1675209600000),
      },
    });

    const startOfFebruary = new Date(now.getFullYear(), 1, 1)
    const endOfFebruary = new Date(now.getFullYear(), 2, 1)
    console.log(startOfFebruary)
    console.log(endOfFebruary)
    const FebruaryData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfFebruary,
        $lt: endOfFebruary,
      },
    });

    const startOfMarch = new Date(now.getFullYear(), 2, 1)
    const endOfMarch = new Date(now.getFullYear(), 3, 1)
    const MarchData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfMarch,
        $lt: endOfMarch,
      },
    });

    const startOfApril = new Date(now.getFullYear(), 2, 1)
    const endOfApril = new Date(now.getFullYear(), 3, 1)
    const AprilData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfApril,
        $lt: endOfApril,
      },
    });

    const startOfMay = new Date(now.getFullYear(), 3, 1)
    const endOfMay = new Date(now.getFullYear(), 4, 1)
    const MayData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfMay,
        $lt: endOfMay,
      },
    });

    const startOfJune = new Date(now.getFullYear(), 4, 1)
    const endOfJune = new Date(now.getFullYear(), 5, 1)
    console.log(startOfFebruary)
    console.log(endOfFebruary)
    const JuneData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfJune,
        $lt: startOfJune,
      },
    });

    const startOfJuly = new Date(now.getFullYear(), 5, 1)
    const endOfJuly = new Date(now.getFullYear(), 6, 1)
    const JulyData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfJuly,
        $lt: endOfJuly,
      },
    });

    const startOfAugust = new Date(now.getFullYear(), 6, 1)
    const endOfAugust= new Date(now.getFullYear(), 7, 1)
    const AugustData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfAugust,
        $lt: endOfAugust,
      },
    });

    const startOfSeptember = new Date(now.getFullYear(), 7, 1)
    const endOfSeptember= new Date(now.getFullYear(), 8, 1)
    const SeptemberData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfSeptember,
        $lt: endOfSeptember,
      },
    });

    const startOfOctober = new Date(now.getFullYear(), 8, 2)
    const endOfOctober= new Date(now.getFullYear(), 9, 2)
    const OctoberData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfOctober,
        $lt: endOfOctober,
      },
    });

    const startOfNovember = new Date(now.getFullYear(), 9, 2)
    const endOfNovember= new Date(now.getFullYear(), 10, 2)
    const NovemberData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfNovember,
        $lt: endOfNovember,
      },
    });

    const startOfDecember = new Date(now.getFullYear(), 10, 2)
    const endOfDecember= new Date(now.getFullYear(), 11, 2)
    const DecemberData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfDecember,
        $lt: new Date(1704067200000),
      },
    });

    const GetAllMonth = [
      januaryData.length,
      FebruaryData.length,
      MarchData.length,
      AprilData.length,
      MayData.length,
      JuneData.length,
      JulyData.length,
      AugustData.length,
      SeptemberData.length,
      OctoberData.length,
      NovemberData.length,
      DecemberData.length,
    ];
    // const statics = (GetAllMonth: any) => {
    //   return {
    //     January: januaryData.length,
    //     February: FebruaryData.length,
    //     March: MarchData.length,
    //     April: AprilData.length,
    //     May: MayData.length,
    //     June: JuneData.length,
    //     July: JulyData.length,
    //     August: AugustData.length,
    //     September: SeptemberData.length,
    //     October: OctoberData.length,
    //     November: NovemberData.length,
    //     December: DecemberData.length,
    //   };
    // };

    // const GetStaticsMonth = GetAllMonth.map(statics);
    // console.log(GetStaticsMonth)
    // console.log(statics);

    res.send(GetAllMonth
      //  total: AugustData.length ,
     );
  } catch (error) {
    res.send(error);
  }
};

export {
  GetWaitingForm,
  BookingCar,
  getFormHistory,
  getInfoUser,
  getCompleteForm,
  GetCancelForm,
  GetBookedForm,
  getFormByDay,
  GetStatics,
};
