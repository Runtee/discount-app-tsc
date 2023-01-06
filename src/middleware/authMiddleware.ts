import { NextFunction, Response } from 'express'
import User ,{Iuser} from '../models/user'
import { AuthRequest } from '../types/app-request'
export default (req:AuthRequest, res:Response, next:NextFunction) => {
    User.findById(req.session.userId, (error:any, user:Iuser) => {
        if (error || !user)
            return res.redirect('/')
        next()
    })
}