import mongoose, { Document } from 'mongoose';

export interface IPayment extends Document {
    userId?: mongoose.Types.ObjectId | string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount?: number;
    plan?: string;
    date: Date;
}

const PaymentSchema = new mongoose.Schema<IPayment>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    },
    amount: {
        type: Number
    },
    plan: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;