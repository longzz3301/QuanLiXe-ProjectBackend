import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import { RequestMiddleware } from "../global/interface";
import {  DriverStatus, FormStatus } from "../global/statusForm";
import DriverModel from "../models/driverModel";
import bookingFormModel from "../models/bookingFormModel";
import { error } from "console";



const CreateDriver = async ( // create Drivers 
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Name_of_driver, date_of_birth, name_of_Cars, email,type_of_cars ,cars_template ,phone   } = req.body;

    const checkDriver = await DriverModel.findOne({
      $or : [
        {Name_of_driver :Name_of_driver},
        {phone:phone} ,
        {email:email} ,
        {cars_template:cars_template}
      ]
    });
    console.log(checkDriver)
    
   

    if (checkDriver) {
      res.send('driver was exits')
      // console.log('1')
      
    } else {
      
      
     
      
      const addDrivers = await DriverModel.create({
        Name_of_driver: Name_of_driver,
        date_of_birth: new Date(date_of_birth),
        phone: phone,
        email: email,
        name_of_Cars:name_of_Cars ,
        type_of_cars:type_of_cars ,
        cars_template:cars_template ,
        // password:hassPassword 

      });
      
      console.log(addDrivers)
      res.send("create drivers success");
    }
  } catch (error) {
    return error;
  }
};

const getAllListDriver =async ( // Delete Driver
req: RequestMiddleware,
res: Response,
next: NextFunction
) => {
  const CheckRoleOperator = req.userId
  
  const getAll = await DriverModel.find({})
  res.send({
    total: getAll.length ,
    data : getAll
  })
}

const DeleteDriver = async ( // Delete Driver
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  // const Name_of_driver = req.params.username
  const Name_of_driver = req.body.Name_of_driver;
  const checkDrivers = await DriverModel.findOne({
    Name_of_driver: Name_of_driver,
  });
  if (checkDrivers) {
    const Deleteed = await DriverModel.deleteOne({
      Name_of_driver: Name_of_driver,
    });
    res.send("delete success");
  } else {
    res.send("not found driver");
  }
};




const DeleteAllDriver = async (req: Request , res : Response , next : NextFunction) => { // delete drivers
  const deleteAllDrivers = await DriverModel.deleteMany({})
  res.send('delete success ')
}

const UpdateDrivers = async ( // cap nhat du lieu driver
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const DriverId = req.params.id;
  const { date_of_birth, phone, email } = req.body;

  const checkDriver = await DriverModel.findById(DriverId);
  // console.log(checkDriver)
  if (checkDriver) {
    const UpdateDrivers = await DriverModel.updateOne(
      { _id: DriverId },
      { date_of_birth: date_of_birth, phone: phone, email: email  },
      { new: true }
    );
    res.send("update succes");
  } else {
    res.send("not found Driver");
  }
};

const GetListDriversAndCarsReady = async ( // loc danh sach car & driver ready 
  // get list car && driver  Ready
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const listBooked = await bookingFormModel.find({
    status: FormStatus.BOOKED.toString(),
    start_time: {
      $lt: new Date(req.body.end),
    },
    end_time: {
      $gt: new Date(req.body.start),
    },
  });
  const ListDriverId = listBooked.map((list) => list.driverId); // get list DriverId busy
  // const listCarsId = listBooked.map((list) => list.carsId); // get list cars busy
  // const ListCarsReady = await CarsModel.find({ _id: { $nin: listCarsId } }); // get list carReady
  const ListDriverReady = await DriverModel.find({
    _id: { $nin: ListDriverId },
  });

  console.log(ListDriverReady);
  res.send(listBooked);
};

const AddCarsAndDriversForm = async ( // add cars and driver to Form book
  // Add cars and driver to form

  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getFormId = req.params.id;
  const checkForm = await bookingFormModel.findById(getFormId);
  const checkStatus = checkForm?.status;

  if (!checkForm) {
    res.status(400).send("Form not found");
  }

  if (checkStatus !== "APPROVED") {
    res.status(400).send("Form invalid");
  }

  
  const getDriversId = req.body.DriverId;
  const checkDriver = await DriverModel.findById(getDriversId);

  

  if (  checkDriver && checkForm) {
    const listBooked = await bookingFormModel.find({
      status: FormStatus.BOOKED.toString(),
      start_time: {
        $lt: checkForm.end_time,
      },
      end_time: {
        $gt: checkForm.start_time,
      },
    });
    const ListDriverId = listBooked.map((list) => list.driverId);
    const ListDriverReady = await DriverModel.find({
      _id: { $nin: ListDriverId },
    });
    if ( ListDriverReady) {
      const checkForm = await bookingFormModel.findById(getFormId);
      const FormId = checkForm?.id;
      const addCarsForm = await bookingFormModel.updateOne(
        { _id: FormId },
        {
          
          driverId: getDriversId,
          status: FormStatus.BOOKED.toString(),
        }
      );
      const newForm = await bookingFormModel.findOne({ _id: getFormId });
      res.send(newForm);
    } else {
      res.status(400).send("cars or driver invalid");
    }
  } else {
    res.status(400).send("Cars or  Drivers invalid");
  }
};

const GetListFormHistory = async ( 
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getStatus = req.query.status ;
  const condition : any = {
    status : {  $nin: [ FormStatus.APPROVED.toString() , FormStatus.WAIT.toString() ]} 

  }
  if (getStatus) {
    condition.status= getStatus
  }
  const getListForm = await bookingFormModel.find(condition)
  res.send({
    total : getListForm.length ,
    data: getListForm
  }) // else res.send (error)
}

const CompleteForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const FormId = req.params.id;
  const updateStatus = FormStatus.COMPLETE;
  const checkForm = await bookingFormModel.findById(FormId);
  const checkFormBooked = checkForm?.status
  console.log(checkForm );
  const opratorName = req.userId;
  
  if (checkForm && checkFormBooked === FormStatus.BOOKED ) {
    // const oprator = await bookingFormModel.create({})
    const ApprovedStatus = await bookingFormModel.findByIdAndUpdate(
      { _id: FormId },
      { status: updateStatus }
    );
    res.send([
      ['Complete success ' , checkForm]
    ] );
  } else {
    res.send("Form invalid");
  }
};



// thống kê driver 

// const AllDriver = async ( 
//   req: RequestMiddleware,
//   res: Response,
//   next: NextFunction
// ) => {
//   // const getDriversIdForm = await bookingFormModel.find({status:FormStatus.BOOKED})
//   const getAllDriver = await DriverModel.find({})
//   getAllDriver.forEach((driver) => {
//     const totaldistanceDriver =  bookingFormModel.find().populate
    

//   })
//   console.log(getAllDriver)
  
//   res.send({
//     total : getAllDriver.length ,
//     data: getAllDriver
//   })
// }

const getDriversIdForm = async ( 
     req: RequestMiddleware,
     res: Response,
     next: NextFunction
   ) => {
      // const driverId = req.params.id

      const getDriversIdForm = await bookingFormModel.find().populate('drivers')
      console.log(getDriversIdForm)
      res.send('oke')
   }





// thống kê xe cần đổ xăng



export {
  
  CreateDriver,
  
  DeleteDriver,
  
  GetListDriversAndCarsReady,
  AddCarsAndDriversForm,
  getAllListDriver ,
  

  UpdateDrivers,
  GetListFormHistory ,
  getDriversIdForm ,
  CompleteForm
  
};
