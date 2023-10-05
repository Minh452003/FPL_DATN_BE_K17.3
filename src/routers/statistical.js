import express from "express";
import { getProductStatistics, getReviewStatistics, getTotalOrders, getUserStatistics } from "../controllers/statistical.js";

const routerStatiscal = express.Router();

routerStatiscal.get('/statistical/orders', getTotalOrders);
routerStatiscal.get('/statistical/products', getProductStatistics);
routerStatiscal.get('/statistical/users', getUserStatistics);
routerStatiscal.get('/statistical/comments', getReviewStatistics);

export default routerStatiscal;