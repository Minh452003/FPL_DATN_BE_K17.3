import express from "express";
import { addProduct, get, getAll, remove, updateProduct } from "../controllers/products.js";
import { checkPermission } from "../middlewares/checkPermission.js";
const routerProducts = express.Router();

routerProducts.get("/products", getAll);
routerProducts.get("/products/:id", get);
routerProducts.delete("/products/:id", checkPermission, remove);
routerProducts.post("/products", checkPermission, addProduct);
routerProducts.patch("/products/:id", checkPermission, updateProduct);


export default routerProducts;