import express from "express";
import { getAll, getOneById, remove, signin, signup } from "../controllers/auth.js";


const routerAuth = express.Router();

routerAuth.get("/users", getAll);
routerAuth.get("/users/:id", getOneById);
routerAuth.delete("/users/:id", remove);
routerAuth.post("/signup", signup);
routerAuth.post("/signin", signin); 

export default routerAuth;
