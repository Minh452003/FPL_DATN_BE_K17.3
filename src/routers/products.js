import express from "express";
import { addProduct, get, getAll, remove, updateProduct } from "../controllers/products.js";

const routerProducts = express.Router();

routerProducts.get("/products", getAll);
routerProducts.get("/products/:id", get);
routerProducts.delete("/products/:id", remove);
routerProducts.post("/products", addProduct);
routerProducts.patch("/products/:id", updateProduct);


export default routerProducts;