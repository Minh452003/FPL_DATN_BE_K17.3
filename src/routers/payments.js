import express from 'express';
import { MomoSuccess, PayMomo, PayPal, PayPalSuccess } from '../controllers/payments.js';
const routerPayment = express.Router();

routerPayment.post("/create_payment_url", PayMomo);
routerPayment.get("/momo", MomoSuccess);
routerPayment.post("/pay", PayPal);
routerPayment.get("/success", PayPalSuccess)

export default routerPayment;

