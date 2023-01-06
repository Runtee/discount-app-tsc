import Discount  from "../models/discount" ;
import User, {Iuser} from '../models/user';
import  { Request, Response } from 'express';
import { AuthRequest } from '../types/app-request';

interface Ishop{
    shopLocation : string,
    email: string,

}
export const grantReward = async (req:Request, res:Response) => {
    try {
        
        const { shopLocation, email }:Ishop = req.body
        const date = Date.now()
        const userId = (await User.findOne({ email: email }))?.id;

        if (!userId) {
            req.flash("error", 'no registered account with the associated email')
            return res.redirect("/admin/grant-reward")
        }
        Discount.create({
            userId: userId, shopLocation: shopLocation, date: date
        }, (error:any, dis) => {
            if (dis) {
                res.render(
                    'admin/add-product', {
                    errors: req.flash('error'),
                    success: req.flash('success'),
                    pageTitle: "add transaction",
                    active: "add",
                    discount: dis

                }
                )
            }
            else {
                const validationErrors = Object.keys(error?.errors).map(key => error?.errors[key]?.message)
                console.log(validationErrors)
                req.flash("error", validationErrors)
                return res.redirect("/admin/grant-reward")
            }
        }
        )

    }
    catch (error:any) {
        req.flash("error", error)
        return res.redirect("/admin/grant-reward")
    }
};
export const grantRewardView = async (req:Request, res:Response) => {
    res.render('admin/add-reward', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: "add transation",
        active: "add"
    })

}
export const deleteReward = async (req:Request, res:Response) => {
    try {
        const id = req.body.id
        console.log(id)
        await Discount.findOneAndDelete({ id: id })
        req.flash("success", "successfully removed transaction")
        return res.redirect("/admin/view-reward")
    }
    catch (error) {
        console.log(error)
        req.flash("error", 'something went wrong')
        return res.redirect("/admin/view-reward")
    }
};
export const viewAllRewards = async (req:Request, res:Response) => {
    const rewards = await Discount.find({}).populate('userId')
    res.render('admin/edit-reward', {
        errors: req.flash('error'),
        rewards: rewards,
        success: req.flash('success'),
        pageTitle: "view transactions",
        active: "view"
    })

}
export const viewAllUserRewards = async (req:AuthRequest, res:Response) => {
    const id = req.session.userId;
    const rewards = await Discount.find({ userId: id })
    var totalAmount = 0
    rewards.filter(reward => totalAmount = Number(reward.discounts) + totalAmount)
    res.render('discounts', {
        errors: req.flash('error'),
        rewards: rewards,
        totalAmount: totalAmount,
        success: req.flash('success'),
        pageTitle: 'rewards'

    })

}
export const viewProduct = async (req:Request, res:Response) => {
    const id = req.params.id;
    const rewards = await Discount.findOne({ "_id": id })
    res.render('products', {
        errors: req.flash('error'),
        rewards: rewards,
        success: req.flash('success'),
        pageTitle: 'rewards'

    })
}
export const addProduct = async (req:Request, res:Response) => {
    try {
        interface Iproduct {
            item: string[] |string ,
             qty:[]|string|number,
              amount: []|string|number,
              discount: number

        }
        interface Iproduct2 {
            item: string,
             qty: string|number,
              amount: string|number,
              discount: number

        }
        const id = req.params.id
        const { item, qty, amount }:Iproduct = req.body
        const dis = { id: id }
        if (!item) {
            res.render(
                'admin/add-product', {
                errors: ["you did not type in any product"],
                success: req.flash('success'),
                pageTitle: "add transaction",
                active: "add",
                discount: dis

            }
            )
        }

        if (typeof (item) == 'object' && typeof (amount) =='object' && typeof qty =='object') {
            const all = []
            var discounts = 0
            for (let i = 0; i < item.length; i++) {
                var itm ={} as Iproduct2 
                itm["item"] = item[i]
                itm["qty"] = qty[i]
                itm["amount"] = amount[i]
                itm["discount"] = (Number(amount[i]) * 0.05).toFixed(2) as any as number
                all.push(itm)
                discounts = discounts + (Number(amount[i]) * 0.05)
            }
            var shoppingAmount = 0
            amount.filter(p => {
                shoppingAmount = shoppingAmount + Number(p)
            })
            Discount.findOneAndUpdate({ _id: id }, { product: all, shoppingAmount: shoppingAmount, discounts: discounts.toFixed(2) }, (er:any , add:any) => {
                console.log(er, add)
                if (er) {
                    const validationErrors = Object.keys(er.errors).map(key => er.errors[key].message)
                    console.log(validationErrors)
                    req.flash("error", validationErrors)
                    res.render(
                        'admin/add-product', {
                        errors: req.flash('error'),
                        success: req.flash('success'),
                        pageTitle: "add transaction",
                        active: "add",
                        discount: dis

                    }
                    )
                }
                else {
                    req.flash("success", "transaction add successfully")
                    res.redirect("/admin/grant-reward")
                }
            })
        }

        else if (typeof (item) !== 'object' && typeof (amount) !=='object'){
            const discount = (Number(amount) * 0.05).toFixed(2) as any as number
            var discounts = (Number(amount) * 0.05).toFixed(2) as any as number
            var shoppingAmount = Number(req.body.amount)
            console.log(discount,
                discounts,
                shoppingAmount)
            const all = []
            Discount.findOneAndUpdate({ _id: id }, { product: [{ ...req.body, discount: discount }], shoppingAmount: shoppingAmount, discounts: discounts }, (er:any, add:any) => {
                console.log(er, add)
                if (er) {
                    const validationErrors = Object.keys(er.errors).map(key => er.errors[key].message)
                    console.log(validationErrors)
                    req.flash("error", validationErrors)
                    res.render(
                        'admin/add-product', {
                        errors: req.flash('error'),
                        success: req.flash('success'),
                        pageTitle: "add transaction",
                        active: "add",
                        discount: dis

                    }
                    )
                }
                else {
                    req.flash("success", "transaction add successfully")
                    res.redirect("/admin/grant-reward")
                }
            })
        }

    }
    catch (error: any) {
        console.log(error)
        req.flash("error", error)
        return res.redirect("/admin/grant-reward")
    }
};

export const viewAllProduct = async (req:Request, res:Response) => {
    const productId = req.params.id
    const product = (await Discount.findOne({ _id: productId }))?.product

    console.log(product)
    res.render('admin/view-product', {
        errors: req.flash('error'),
        product: product,
        success: req.flash('success'),
        pageTitle: "view transactions",
        active: "view"
    })

}