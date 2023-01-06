import mongoose, { Types } from 'mongoose';

const Schema=mongoose.Schema;

export interface Idiscount{
    userId: Types.ObjectId,
    shopLocation: string,
    shoppingAmount: number,
    product:Types.DocumentArray<Iproduct>,
    discounts: number,
    date: Date

}
export interface Iproduct{
    item: string,
    qty:number,
    amount: number,
    discount: number
}

const discountSchema=new Schema<Idiscount>({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user id is required']
    },
    shopLocation:{
        type:String,
        required:[true, 'shop location is required']
    },
    shoppingAmount:{
        type:Number,
    },
    product:{
        type:[{
            item: String,
            qty:Number,
            amount: Number,
            discount: Number
        }],
    },
    discounts:{
        type:Number,
    },
    date:{
        type:Date,
        required:[true ,'dates is required']
    }

})

const Discount =  mongoose.model<Idiscount>('discount',discountSchema);

export default Discount