import express from "express";
import { getReviewStatistics, getTopSellingProducts, getRevenueAndProfit, getUserStatistics, getTopViewedProducts, getTotalSoldQuantity, getTotalCreatedProducts, getTotalOrder, getSellingProductsData } from "../controllers/statistical.js";

const routerStatiscal = express.Router();

routerStatiscal.get('/statistical/orders', getRevenueAndProfit);
routerStatiscal.get('/statistical/products-sell', getTopSellingProducts);
routerStatiscal.get('/statistical/products-selling', getSellingProductsData);
routerStatiscal.get('/statistical/products-view', getTopViewedProducts);
routerStatiscal.get('/statistical/products-sold', getTotalSoldQuantity);
routerStatiscal.get('/statistical/products-total', getTotalCreatedProducts);
routerStatiscal.get('/statistical/order-count', getTotalOrder);
routerStatiscal.get('/statistical/users', getUserStatistics);
routerStatiscal.get('/statistical/comments', getReviewStatistics);

export default routerStatiscal;