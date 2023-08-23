import express from "express";
import { signin, signup } from "../controllers/auth.js"
const routerAuth = express.Router();

routerAuth.post("/signup", signup);
routerAuth.post("/signin", signin);
export default routerAuth;