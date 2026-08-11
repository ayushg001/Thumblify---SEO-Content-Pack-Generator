
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Request, Response } from 'express';
import plans from '../config/plans.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Create Order for Razorpay Payment
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { plan, amount } = req.body;

        let orderAmount = 0;
        if (plan && plans[plan]) {
            orderAmount = plans[plan].price * 100; // in paise
        } else if (amount) {
            orderAmount = Number(amount) * 100;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid plan or amount' });
        }

        const options = {
            amount: orderAmount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return res.status(500).json({ success: false, message: 'Failed to create order' });
    }
};


// Verify Razorpay Payment Signature and Upgrade User Plan
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const { userId } = req.session;
        let {plan} = req.body;

        plan = String(plan).toLowerCase();

        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Save payment details
            const newPayment = new Payment({
                userId,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                plan: plan,
                amount: plans[plan]?.price || 0
            });
            await newPayment.save();

            // Upgrade User Plan & Add Credits
            if (userId) {
                const user = await User.findById(userId);
                if (user) {
                    user.plan = plan;
                    user.credits += plans[plan].credits;
                    await user.save();
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Payment verified and plan upgraded successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed: Invalid signature'
            });
        }
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error);
        return res.status(500).json({ success: false, message: 'Failed to verify payment' });
    }
};
