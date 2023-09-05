import express from "express";
import { addProduct, get, getAll, getAllDelete, remove, removeForce, restoreProduct, updateProduct } from "../controllers/products.js";
import { authorization } from "../middlewares/authorization.js";
import { authenticate } from "../middlewares/authenticate.js";
const routerProducts = express.Router();

routerProducts.get("/products", getAll);
routerProducts.get("/products/delete", getAllDelete);
routerProducts.get("/products/:id", get);
routerProducts.delete("/products/:id", authenticate, authorization, remove);
routerProducts.delete("/products/force/:id", authenticate, authorization, removeForce);
routerProducts.post("/products", authenticate, authorization, addProduct);
routerProducts.patch("/products/:id", authenticate, authorization, updateProduct);
routerProducts.patch("/products/restore/:id", authenticate, authorization, restoreProduct);


export default routerProducts;