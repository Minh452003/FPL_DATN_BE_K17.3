import express from 'express';
import { PayMomo, PayPal, PayPalSuccess } from '../controllers/payments.js';
const routerPayment = express.Router();

routerPayment.post("/create_payment_url", PayMomo);
routerPayment.post("/pay", PayPal);
routerPayment.get("/success", PayPalSuccess)

export default routerPayment;

