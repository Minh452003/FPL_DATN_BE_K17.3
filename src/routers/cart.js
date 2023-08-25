import express from "express";
import { add, getAll, getById, remove } from "../controllers/cart.js";

const cartRouter = express.Router();

cartRouter.get("/carts", getAll);
cartRouter.get("/carts/:id", getById);
cartRouter.delete("/carts/:id", remove);
cartRouter.post("/carts", add);

export default cartRouter;
