import mongoose from 'mongoose';
import bcrypt  from 'bcrypt';
import { Types } from 'mongoose';

const Schema=mongoose.Schema;

export interface Iadmin {
    _id: Types.ObjectId,
    email:string,
    password: string,
}
const adminSchema=new Schema <Iadmin>({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

})

adminSchema.pre('save', function (next):void {
    const user = this
    bcrypt.hash(user.password, 10, (error:Error | undefined, hash:string) => {
        user.password = hash
        next()
    })

})
const Admin =  mongoose.model<Iadmin>('admin',adminSchema);

export default Admin