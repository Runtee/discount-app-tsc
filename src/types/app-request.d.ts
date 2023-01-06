import { Request } from "express";
import Iuser from "../models/user"
import { session } from "express-session"
import { Request } from "express"
type Requests = Request & { session: Express.Session };
declare interface AuthRequest extends Requests {
    user: Iuser,
    userId: string,
    isAuthenticated: boolean
}
declare interface AdminRequest extends Requests {
    user: Iuser,
    userId: string
}
declare module 'express-serve-static-core' {
    interface Response {
        user: Iuser,
        userId: string,
        isAuthenticated: boolean
    }
}