import mongoose, {Types} from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

export interface Iuser{
_id: Types.ObjectId;
fullname:string,
email:string,
phone:string,
address:string,
password:string
}
const userSchema = new Schema<Iuser>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

})

userSchema.pre('save', function (next):void {
    const user = this
    bcrypt.hash(user.password, 10, (error: Error | undefined, hash:string) => {
        user.password = hash
        next()
    })

})
const User = mongoose.model<Iuser>('user', userSchema);

export default User