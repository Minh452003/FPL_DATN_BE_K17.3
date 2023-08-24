import express from "express";
import { RemoveCategory, addCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/category.js";

const routerCategory = express.Router();

routerCategory.post("/category", addCategory)
routerCategory.get("/category/:id", getCategoryById)
routerCategory.delete("/category/:id", RemoveCategory)
routerCategory.get("/category", getAllCategory)
routerCategory.patch("/category/:id", updateCategory)


export default routerCategory;