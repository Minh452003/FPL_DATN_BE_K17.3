import express from "express";
import { getAll, getOneById, remove } from "../controllers/auth.js";


const routerUser = express.Router();

routerUser.get("/users", getAll);
routerUser.get("/users/:id", getOneById);
routerUser.delete("/users/:id", remove);

export default routerUser
