import mongoose, { Document } from 'mongoose';
import plans from '../config/plans.js';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    plan: string;
    credits: number;
    creditsResetAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    name : {
        type : String ,
        required : true,
        trim : true
    },
    email : {
        type : String , 
        required : true ,
        trim : true,
        unique: true
    },
    password : {
        type : String ,
        required : true,
    },
    plan : {
        type : String,
        enum : ['free' , 'pro' , 'premium'],
        default : 'free'
    }, 
    credits : {
        type : Number ,
        default : plans.free.credits
    },
    creditsResetAt : {
        type : Date ,
        default : ()=> {
            const d = new Date();
            d.setMonth(d.getMonth() +1);
            return d;
        }
    }
} , {timestamps : true});     // timestamps will automatically create the 'Created_At' field

const User = mongoose.models.User || mongoose.model<IUser>('User' , UserSchema);

export default User;