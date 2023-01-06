import { NextFunction, Response } from 'express'
import Admin, { Iadmin } from '../models/admin'
import { AuthRequest, } from '../types/app-request'

export default (req:AuthRequest, res:Response, next:NextFunction) => {
    Admin.findById(req.session.userId, (error:any, user:Iadmin) => {
        if (error || !user)
            return res.redirect('/admin')
        next()
    })
}