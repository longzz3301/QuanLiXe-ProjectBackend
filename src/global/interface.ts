import { Request } from "express"

export interface Obj {
    [k: string]: {} | undefined | unknown
}

export interface RequestMiddleware extends Request {
    email?: string ;
    password?: string ;
    officeCode?: string ;
    username?: string ;
    age?: number;
    phone?: string
    userId?: string;
    role?: string;
    user?:Object

}