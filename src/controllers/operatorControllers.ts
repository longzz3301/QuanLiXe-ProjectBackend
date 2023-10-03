import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import { RequestMiddleware } from "../global/interface";
import {   FormStatus } from "../global/statusForm";
import DriverModel from "../models/driverModel";
import bookingFormModel from "../models/bookingFormModel";
import { error } from "console";



const CreateDriver = async ( // create Drivers 
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Name_of_driver, date_of_birth, name_of_Cars, email,type_of_cars ,cars_template ,phone ,image   } = req.body;

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
        image : image
        // password:hassPassword 

      });
      
      console.log(addDrivers)
      res.send("create drivers success");
    }
  } catch (error) {
    return error;
  }
};

const GetListFormApproved = async  ( 
req: RequestMiddleware,
res: Response,
next: NextFunction
) => {
  const condition: any = {
    // userId: userId,
    status: FormStatus.APPROVED,
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


  
  const listApprovedByDay = await bookingFormModel.find(condition);
  
  // const getListFormApproved = await bookingFormModel.find({status: FormStatus.APPROVED})
  // console.log(getListFormApproved)

  res.send({
    total: listApprovedByDay.length ,
    data: listApprovedByDay
  })
}

const getAllListDriver =async ( // Delete Driver
req: RequestMiddleware,
res: Response,
next: NextFunction
) => {
  const CheckRoleOperator = req.userId
  
  const getAll = await DriverModel.find({})
  console.log("getAll: ", getAll)
  res.send({
    total: getAll.length ,
    data : getAll
  })
}

const getStaticDriver =async ( // Delete Driver
req: RequestMiddleware,
res: Response,
next: NextFunction
) => {
  const CheckRoleOperator = req.userId
  
  const getAll = await DriverModel.find({})
  const driverId = getAll.map((driver:any) => driver.id )
  console.log("driverId" , driverId )
  // console.log("getAll: ", getAll)
  const getFormComplete = await bookingFormModel.find({  driverId: {$in : driverId},  status:FormStatus.COMPLETE})

console.log("getFormComplete :" , getFormComplete)

  
  const getFormEachDriver = getAll.map((driver) => {
    // const driverName = driver.Name_of_driver
    const formofDriver =  getFormComplete.filter((form) => form.driverId === driver.id)
    const Distance = formofDriver.map((distances) =>  distances.calculateDistance)
    const totalDistance = Distance.reduce((accumulator:any, currentValue) => accumulator + currentValue, 0);

    return {
      id: driver.id,
      name: driver.Name_of_driver,
      formCount: formofDriver.length ,
      numberKilometers : totalDistance
    }
  })

  console.log("getFormEachDriver : " ,getFormEachDriver  )

  



  // console.log("getTotalForm :" , getTotalForm)
  res.send({
    total: getAll.length ,
     number1 : getAll ,
    data: getFormEachDriver
  })
}

const getBestDriver =  async ( // Delete Driver
req: RequestMiddleware,
res: Response,
next: NextFunction
) => {
const getAll = await DriverModel.find({})
const driverId = getAll.map((driver:any) => driver.id )
// console.log("getAll: ", getAll)
const getFormComplete = await bookingFormModel.find({  driverId: {$in : driverId},  status:FormStatus.COMPLETE})

console.log("getFormComplete :" , getFormComplete)
const getFormEachDriver = getAll.map((driver) => {
  // const driverName = driver.Name_of_driver
  const formofDriver =  getFormComplete.filter((form) => form.driverId === driver.id)
  const Distance = formofDriver.map((distances) =>  distances.calculateDistance)
  const totalDistance = Distance.reduce((accumulator:any, currentValue) => accumulator + currentValue, 0);

  return {
    id: driver.id,
    name: driver.Name_of_driver,
    
    numberKilometers : totalDistance
  }
})
function findMaxKilometersName(getFormEachDriver:any) {
  let maxKilometers = -Infinity;
  let nameWithMaxKilometers = null;

  for (const item of getFormEachDriver) {
      const kilometers = item.numberKilometers;
      if (kilometers !== null && kilometers > maxKilometers) {
          maxKilometers = kilometers;
          nameWithMaxKilometers = item.name;
      }
  }

  return nameWithMaxKilometers;
}

// Gọi hàm để lấy ra name có numberKilometers lớn nhất
const maxKilometersName = findMaxKilometersName(getFormEachDriver);

if (maxKilometersName) {
  console.log("Tên có số kilometers lớn nhất là:", maxKilometersName);
} else {
  console.log("Không có giá trị numberKilometers nào trong danh sách.");
}

res.send(maxKilometersName)

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

// const UpdateDrivers = async ( // cap nhat du lieu driver
//   req: RequestMiddleware,
//   res: Response,
//   next: NextFunction
// ) => {
//   const DriverId = req.params.id;
//   const { date_of_birth, phone, email } = req.body;

//   const checkDriver = await DriverModel.findById(DriverId);
//   // console.log(checkDriver)
//   if (checkDriver) {
//     const UpdateDrivers = await DriverModel.updateOne(
//       { _id: DriverId },
//       { date_of_birth: date_of_birth, phone: phone, email: email  },
//       { new: true }
//     );
//     res.send("update succes");
//   } else {
//     res.send("not found Driver");
//   }
// };

const UpdateDrivers = async ( // cap nhat du lieu driver
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const DriverId = req.params.id;
  
  const { Name_of_driver,  date_of_birth, phone, name_of_Cars , cars_template , type_of_cars
  } = req.body;
  const name = Name_of_driver

  const checkDriver = await DriverModel.findOne({Name_of_driver:name});
  // console.log(checkDriver)
  if (checkDriver) {
    const UpdateDrivers = await DriverModel.updateOne(
      { Name_of_driver: Name_of_driver },
      { phone: phone, name_of_Cars:name_of_Cars ,cars_template:cars_template , type_of_cars:type_of_cars
      },
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

  // console.log(ListDriverReady);
  res.send({
    total:ListDriverReady.length ,
    data: ListDriverReady
  });
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
      const newForm = await bookingFormModel.findOne({ _id: FormId });
      res.send({
        messge: "Add Cars to Form success" ,
        data: newForm
      });
    } else {
      res.status(400).send("cars or driver invalid");
    }
  } else {
    res.status(400).send("Cars or  Drivers invalid");
  }
};

const GetListFormBooked = async ( 
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const condition: any = {
    status: FormStatus.BOOKED
  }
  const getListBooked = await bookingFormModel.find(condition)
  res.send({
    total: getListBooked ,
    data: getListBooked
  })
}



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

const UpdateFormComplete = async (
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

const getTotalCar = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) =>{
  const getAllDriver = await DriverModel.find({})
  res.send({
    total : getAllDriver.length, 
    data: getAllDriver
  })
}

const getTotalFormComplete = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) =>{
  const getTotalFormComplete = await bookingFormModel.find({status:FormStatus.COMPLETE})
  res.send({
    total : getTotalFormComplete.length, 
    data: getTotalFormComplete
  })
}

const GetListFormCancel = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getFormCancel = await bookingFormModel.find({status: FormStatus.CANCEL})

  res.send({
    total: getFormCancel.length,
    data: getFormCancel
  })
}


const GetListFormComplete = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getFormComplete = await bookingFormModel.find({status: FormStatus.COMPLETE})
  // const DriverId = getFormComplete.map((get) => get.driverId )
  
  console.log("getFormComplete: ", getFormComplete)
  // console.log("DriverId", DriverId)
  const rs: any[] = []
 
  for await (const iterator of getFormComplete) {
    const driver = await DriverModel.findById(iterator.driverId)
    console.log("driver: ", driver)
    rs.push({
      id: iterator.id,
      start_time: iterator.start_time,
      end_time: iterator.end_time,
      start_location: iterator.start_location,
      end_location: iterator.end_location,
      status: iterator.status,
      number_people: iterator.number_people,
      reason: iterator.reason,
      userId: iterator.userId,
      create_at: iterator.create_at,
      // __v: ,
      calculateDistance: iterator.calculateDistance,
      calculateTime: iterator.calculateTime,
      driverId: iterator.driverId,
      driverName: driver?.Name_of_driver
    })
  }
  // const rs = getFormComplete.map(async (f: any) => {
  //   const driver = await DriverModel.findById(f.driverId)
  //   return {
  //     ...f,
  //     driverName: driver?.Name_of_driver
  //   }
  // })
  // console.log("rs: ", rs)

  res.send({
    total: rs.length,
    data: rs
  })
}
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





// thong ke km
// const getKmForm = async ( 
//   req: RequestMiddleware,
//   res: Response,
//   next: NextFunction
// ) => {
//   const condition = {
//     status:FormStatus.COMPLETE
//   }
//   const getForm = await bookingFormModel.find(condition)
//   res.send(getForm)
// }

// const StacticsDriver = async ( 
//   req: RequestMiddleware,
//   res: Response,
//   next: NextFunction
// ) => {
//   const getAllDriver = await DriverModel.find({})
//   console.log(getAllDriver)

  
//   // const driverIds = getAllDriver.map((driver) => driver._id);
//   // const getListForm = await bookingFormModel.find({})

//   const DriverForm = await DriverModel.aggregate([
//     {
//       $lookup: {
//         from: "formbookings", // Tên của collection Form
//         localField: "_id",
//         foreignField: "driverId", // Trường chứa ID của Driver trong collection Form
//         as: "formbookings" // Tạo một trường mới "forms" chứa thông tin về các Form của mỗi Driver
//       }
//     },
//     {
//       $project: {
//         "_id": 1, // Giữ lại trường _id của Driver
//         "Name_of_driver": 1, // Giữ lại trường Name_of_driver của Driver
//         "totalForms": { $size: "$formbookings" } // Tính số lượng Form cho mỗi Driver
//       }
//     },
//     {
//       $group: {
//         _id: "$_id",
//         Name_of_driver: { $first: "$Name_of_driver" }, // Lấy lại tên của Driver
//         totalForms: { $sum: "$totalForms" } // Tính tổng số Form cho mỗi Driver
//       }
//     }
//   ]);
  

  
//   res.send({
//     total:DriverForm.length ,
//     data:DriverForm
//   })
// }



export {
  
  CreateDriver,
  
  DeleteDriver,
  
  GetListDriversAndCarsReady,
  AddCarsAndDriversForm,
  getAllListDriver ,
  

  UpdateDrivers,
  GetListFormHistory ,
  getDriversIdForm ,
  UpdateFormComplete ,
  GetListFormApproved ,
  getTotalCar ,
  getTotalFormComplete ,
  // getKmForm ,
  GetListFormBooked,
  GetListFormCancel ,
  GetListFormComplete,
  // StacticsDriver
  getStaticDriver,
  getBestDriver
  
};



// db.Driver.aggregate([
//   {
//     $lookup: {
//       from: "Form", // Tên của collection Form
//       localField: "_id",
//       foreignField: "driverId", // Trường chứa ID của Driver trong collection Form
//       as: "forms" // Tạo một trường mới "forms" chứa thông tin về các Form của mỗi Driver
//     }
//   },
//   {
//     $project: {
//       "_id": 1, // Giữ lại trường _id của Driver
//       "Name_of_driver": 1, // Giữ lại trường Name_of_driver của Driver
//       "totalForms": { $size: "$forms" } // Tính số lượng Form cho mỗi Driver
//     }
//   },
//   {
//     $group: {
//       _id: "$_id",
//       Name_of_driver: { $first: "$Name_of_driver" }, // Lấy lại tên của Driver
//       totalForms: { $sum: "$totalForms" } // Tính tổng số Form cho mỗi Driver
//     }
//   }
// ]);

