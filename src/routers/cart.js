import express from "express";
import { changeQuantity, clearUserCart, create, getOne, removeProduct } from "../controllers/cart.js";

const cartRouter = express.Router();

cartRouter.get("/carts/:id", getOne);
cartRouter.post("/carts/:id/create", create);
cartRouter.delete("/carts/:id/remove-product", removeProduct);
cartRouter.delete("/carts/:id/clear-user",clearUserCart );
cartRouter.put("/carts/:id/change-quantity",changeQuantity );

export default cartRouter;
