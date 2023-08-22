import express from "express";
import { get, getAll, remove } from "../controllers/products.js";

const routerProducts = express.Router();

routerProducts.get("/products", getAll);
routerProducts.get("/products/:id", get);
routerProducts.delete("/products/:id", remove);

export default routerProducts;