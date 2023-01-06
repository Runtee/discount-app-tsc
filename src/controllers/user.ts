import Discount from "../models/discount";
import User, { Iuser } from '../models/user';
import { Request, Response } from 'express';
import { AuthRequest } from '../types/app-request';
import mongoose from 'mongoose'
const ObjectId=  mongoose.Types.ObjectId; 

export const dashboard = async (req: AuthRequest, res: Response) => {
    const id: string = req.session.userId;
    const rewards = await Discount.find({ userId: id })
    const user = await User.findOne({ _id: new ObjectId(id) })
    var totalAmount = 0
    rewards.filter(reward => totalAmount = Number(reward.discounts) + totalAmount)
    console.log(user)
    res.render('dashboard', {
        pageTitle: "dashboard",
        totalAmount: totalAmount,
        user: user

    })

};
export const profileView = async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.session.userId)
    res.render('profile', {
        errors: req.flash('validationErrors'),
        user: user,
        success: req.flash('success'),
        pageTitle: 'profile'

    })

}


export const profile = (req: AuthRequest, res: Response) => {
    interface IUprofile {
        fullName: string
        phone: string
        address: string
    }
    let Uprofile: IUprofile = {
        fullName: req.body.fullname,
        phone: req.body.phone,
        address: req.body.address,

    }
    let id: string = req.session.userId
    User.findOneAndUpdate({ _id: id }, Uprofile, (error: any, user: Iuser) => {
        if (error) {
            const validationErrors = Object.keys(error.errors).map(key =>
                error.errors[key].message)
            req.flash('error', validationErrors)
            res.redirect('/dashboard/profile')
        }
        else {
            req.flash('success', 'Successfully updated your profile')
            res.redirect('/dashboard/profile')
        }

    })
}