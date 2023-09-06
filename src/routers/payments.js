import express from 'express';
import { PayMomo } from '../controllers/payments.js';
const routerPayment = express.Router();

routerPayment.post("/create_payment_url", PayMomo);
// routerPayment.get("/vnpay_return", CheckPay)
export default routerPayment;

