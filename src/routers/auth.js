import express from "express";
import { getAll, getOneById, logout, refreshToken, remove, signin, signup } from "../controllers/auth.js";
import { authorization } from "../middlewares/authorization.js";
import { authenticate } from "../middlewares/authenticate.js";


const routerAuth = express.Router();

routerAuth.get("/users", getAll);
routerAuth.get("/users/:id", getOneById);
routerAuth.delete("/users/:id", authenticate, authorization, remove);
routerAuth.post("/signup", signup);
routerAuth.post("/signin", signin);
routerAuth.post("/logout", authenticate, logout);
routerAuth.post("/refresh", refreshToken);


export default routerAuth;
