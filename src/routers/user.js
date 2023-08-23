import express from "express";
import { getAll, getOneById, remove, signin, signup } from "../controllers/auth.js";


const routerUser = express.Router();

routerUser.get("/users", getAll);
routerUser.get("/users/:id", getOneById);
routerUser.delete("/users/:id", remove);
routerUser.post("/signup", signup);
routerUser.post("/signin", signin);
export default routerUser
