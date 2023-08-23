import express from "express";
import { addCategory, updateCategory } from "../controllers/category.js";

const routerCategory = express.Router();

routerCategory.post("/category", addCategory)
routerCategory.patch("/category/:id", updateCategory)

export default routerCategory;