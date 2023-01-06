import bcrypt  from 'bcrypt'
import User,{Iuser}  from '../models/user'
import  { Request, Response } from 'express';
import {  AuthRequest } from '../types/app-request';

export const changePasswordView = (req:Request, res:Response) => {
    res.render('changePassword', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: 'change password'

    })
};
export const home = (req:Request, res:Response) => {
    res.render('home',{pageTitle: 'D ICON REWARDS Home'})
}
export const signinView = (req:Request, res:Response) => {
    res.render('signin', {
        errors: req.flash('error'),
        pageTitle: 'signin D ICON REWARDS'
    })
}

export const login = (req:AuthRequest, res:Response) => {
    interface body{
        email:string,
        password:string
    }
    const { email, password }:body = req.body;
    User.findOne({ email: email }, (error:any, user:Iuser) => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    req.session.userId = user._id// if passwords match
                    // // store user session
                    req.isAuthenticated = true
                    res.redirect('/dashboard')
                }
                else {
                    const validationErrors = ['login details, not correct']
                    req.flash('error', validationErrors)
                    res.redirect('/signin')
                }
            })
        }
        else {
            const validationErrors = ['login details, not correct']
            req.flash('error', validationErrors)
            res.redirect('/signin')
        }
    }
    )
}


export const changePassword = async (req:AuthRequest, res:Response) => {
    const password: string = req.body.password;
    const newPassword: string = req.body.npassword;
    const Confirmpassword: string = req.body.cpassword;
    var id = req.session.userId
    bcrypt.hash(newPassword, 10, (e, newhash) => {
        User.findById(id, (error:any, user:Iuser) => {
            if (user) {
                bcrypt.compare(password, user.password, (error, same) => {
                    if (same) {
                        if (newPassword === Confirmpassword) {
                            // var usr = bcrypt.hash(newPassword, 10)
                            User.findByIdAndUpdate(id, { 'password': newhash }, (err, upd) => {
                                if (upd) {
                                    req.flash('success', 'Password successfuly changed')
                                    res.redirect('/dashboard/changepassword')
                                }
                            });

                        }
                        else {
                            const validationErrors = ['confirm password is not the same with new password']
                            req.flash('error', validationErrors)
                            req.flash('data', req.body)
                            res.redirect('/dashboard/changepassword')

                        }
                    }
                    else {
                        const validationErrors = ['password is not correct']
                        req.flash('error', validationErrors)
                        req.flash('data', req.body)
                        res.redirect('/dashboard/changepassword')

                    }
                })

            }
            else{
                throw error
            }
        })
    })
}
export const signupView = (req:Request, res:Response) => {
    res.render('signup', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: 'signup D ICON REWARDS'

    }
    )
}

export const signup = async (req:AuthRequest, res:Response) => {
    interface body {
        fullname:string,
        password:string, 
        address:string, 
        email:string, 
        phone:string 
    }
    const { fullname, password, address, email, phone } : body = req.body;
    const checkUser = await User.findOne({ email: email })
    if (checkUser) {
        req.flash('error', "email already exists")
        return res.redirect('/signup');
    }

    User.create({ fullname: fullname, password: password, address: address, email: email, phone: phone }, (error:any, user:Iuser) => {
        if (error) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('error', validationErrors)
            req.flash('data', req.body)
            return res.redirect('/signup');
        }
        else {
            req.flash('success', 'Successfully created an account')
            req.session.userId = user._id
            res.redirect('/dashboard');
        }
    }
    )
}

