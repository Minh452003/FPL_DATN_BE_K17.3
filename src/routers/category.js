import express from "express";
import { RemoveCategory, addCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/category.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const routerCategory = express.Router();

routerCategory.post("/category",checkPermission, addCategory)
routerCategory.get("/category/:id", getCategoryById)
routerCategory.delete("/category/:id",checkPermission, RemoveCategory)
routerCategory.get("/category", getAllCategory)
routerCategory.patch("/category/:id",checkPermission, updateCategory)


export default routerCategory;