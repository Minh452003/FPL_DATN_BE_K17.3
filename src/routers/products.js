import express from "express";
import { addProduct, get, getAll, getAllDelete, remove, removeForce, restoreProduct, updateProduct } from "../controllers/products.js";
import { checkPermission } from "../middlewares/checkPermission.js";
const routerProducts = express.Router();

routerProducts.get("/products", getAll);
routerProducts.get("/products/delete", getAllDelete);
routerProducts.get("/products/:id", get);
routerProducts.delete("/products/:id", checkPermission, remove);
routerProducts.delete("/products/force/:id", checkPermission, removeForce);
routerProducts.post("/products", checkPermission, addProduct);
routerProducts.patch("/products/:id", checkPermission, updateProduct);
routerProducts.patch("/products/restore/:id", checkPermission, restoreProduct);


export default routerProducts;