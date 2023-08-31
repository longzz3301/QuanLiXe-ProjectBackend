import { object } from "yup";
import { NextFunction , Request, Response } from "express"
import * as yup from 'yup';

const validate = (schema: yup.AnySchema) => async (req: Request, res:Response , next : NextFunction)=> {
   try {  await schema.validate({
    body: req.body ,
    query: req.query ,
    params : req.params

})
    
   } catch (error) {
    return res.status(400).send(error)
    
   }

}


export default validate