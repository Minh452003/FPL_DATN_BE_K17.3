import express from "express";
import { createColor, getColor, getColorById, removeColor, updateColor } from "../controllers/color.js";

const routerColor = express.Router();

routerColor.get("/color", getColor);
routerColor.get("/color/:id", getColorById);
routerColor.delete("/color/:id", removeColor);
routerColor.post("/color", createColor);
routerColor.patch("/color/:id", updateColor);


export default routerColor;