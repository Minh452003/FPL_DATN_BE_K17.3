import express from "express";
import { addCategory, getAllCategory, getCategoryById, removeCategory, updateCategory } from "../controllers/category.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const routerCategory = express.Router();

routerCategory.post("/category", checkPermission, addCategory)
routerCategory.get("/category/:id", getCategoryById)
routerCategory.delete("/category/:id", checkPermission, removeCategory)
routerCategory.get("/category", getAllCategory)
routerCategory.patch("/category/:id", checkPermission, updateCategory)


export default routerCategory;