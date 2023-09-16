import express from "express";
import { createSize, getSize, getSizeById, removeSize, updateSize } from "../controllers/size.js";

const routerSize = express.Router();

routerSize.get("/size", getSize);
routerSize.get("/size/:id", getSizeById);
routerSize.delete("/size/:id", removeSize);
routerSize.post("/size", createSize);
routerSize.patch("/size/:id", updateSize);


export default routerSize;