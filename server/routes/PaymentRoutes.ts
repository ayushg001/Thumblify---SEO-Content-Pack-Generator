import express from 'express';
import { createOrder, verifyPayment } from '../controllers/PaymentControllers.js';
import protect from '../middlewares/auth.js';

const PaymentRouter = express.Router();

PaymentRouter.post('/create-order', protect, createOrder);
PaymentRouter.post('/verify-payment', protect, verifyPayment);

export default PaymentRouter;