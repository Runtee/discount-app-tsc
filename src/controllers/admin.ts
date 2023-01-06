import bcrypt from 'bcrypt';
import Admin , {Iadmin} from '../models/admin';
import User, {Iuser} from '../models/user';
import  { Request, Response } from 'express';
import { AdminRequest, AuthRequest } from '../types/app-request';

interface body {
    email : string, 
    password : string
}

export const changePasswordView = (req : Request, res: Response) => {
    res.render('admin/admin changePassword', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: 'admin change-password',
        active: "password"

    })
};
export const dashboard = (req:Request, res:Response) => {
    res.render('admin/admin dashboard', {
        pageTitle: "admin",
        active: "dashboard"
    })

};
export const signinView = async (req:Request, res:Response) => {
    const user = await Admin.findOne({email:'admin@gmail.com'});
    if (!user){
        await Admin.create({email:'admin@gmail.com',password:'admin1234'})
    }
    res.render('admin/signin', {
        errors: req.flash('error'),
        pageTitle: 'admin signin'
    })
}

export const login = (req:AuthRequest, res:Response) => {
    interface body {
        email : string, 
        password : string
    }
    interface Iemail{
        email : string
    }
    const { email, password }:body = req.body;
    Admin.findOne( <Iuser>{ email: email }, (error : Error | undefined  , user:Iuser | null) => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    req.session.userId = user._id// if passwords match
                    // // store user session
                    // req.isAuthenticated = true
                    res.redirect('/admin/dashboard')
                }
                else {
                    const validationErrors = ['login details, not correct']
                    req.flash('error', validationErrors)
                    res.redirect('/admin')
                }
            })
        }
        else {
            const validationErrors = ['login details, not correct']
            req.flash('error', validationErrors)
            res.redirect('/admin')
        }
    }
    )
}


export const changePassword = async (req : AuthRequest, res: Response) => {
    const password:string = req.body.password;
    const newPassword:string = req.body.npassword;
    const Confirmpassword:string = req.body.cpassword;
    var id:string = req.session.userId
    bcrypt.hash(newPassword, 10, (e:Error | undefined , newhash:string) => {
        Admin.findById(id, (error:Error | undefined, user:Iadmin) => {
            if (user) {
                bcrypt.compare(password, user.password, (error, same) => {
                    if (same) {
                        if (newPassword === Confirmpassword) {
                            // var usr = bcrypt.hash(newPassword, 10)
                            Admin.findByIdAndUpdate(id, { 'password': newhash }, (err, upd) => {
                                if (upd) {
                                    req.flash('success', 'Password successfuly changed')
                                    res.redirect('/admin/changepassword')
                                }
                            });

                        }
                        else {
                            const validationErrors = ['confirm password is not the same with new password']
                            req.flash('error', validationErrors)
                            req.flash('data', req.body)
                            res.redirect('/admin/changepassword')

                        }
                    }
                    else {
                        const validationErrors = ['password is not correct']
                        req.flash('error', validationErrors)
                        req.flash('data', req.body)
                        res.redirect('/admin/change-password')

                    }
                })

            }
            else {
                req.flash('error', 'not successfully')
                res.redirect('/admin/changepassword')
            }
        })
    })
}
export const signupView = (req : Request, res:Response) => {
    res.render('signup', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: 'signup'
    }
    )
}

export const signup = async (req:AuthRequest, res:Response) => {
    const { password, email }:body = req.body;
    const checkAdmin = await Admin.findOne({ email: email })
    if (checkAdmin) {
        req.flash('error', "email already exists")
        return res.redirect('/signup');
    }

    Admin.create({ password: password, email: email }, (error: any , user: Iadmin) => {
        if (error) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('error', validationErrors)
            req.flash('data', req.body)
            return res.redirect('/signup');
        }
        else {
            req.flash('success', 'Successfully created an account')
            req.session.userId = user._id
            res.redirect('/users');
        }
    }
    )
}

export const getAllUsers = async (req:Request, res:Response, ) => {
    const users = await User.find({})
    res.render('admin/remove', {
        errors: req.flash('error'),
        success: req.flash('success'),
        users: users,
        pageTitle: "view users",
        active: "user"

    })
}

export const deleteUser = async (req:Request, res:Response) => {
    try {
        const id = req.body.id
        await User.findOneAndDelete({ _id: id })
        req.flash("success", "successfully removed user")
        return res.redirect("/admin/get-users")
    }
    catch (error: any) {
        req.flash("error", error)
        console.log(error)
        return res.redirect("/admin/get-users")
    }
};


export const addProduct = async (req:Request,  res:Response)=>{
    res.render('admin/add-product', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: "view users",
        active: "user"

    })   
}