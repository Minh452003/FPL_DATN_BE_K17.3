import express from "express";
import { addCategory, getAllCategory, getAllDelete, getCategoryById, removeCategory, removeForce, restoreCategory, updateCategory } from "../controllers/category.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const routerCategory = express.Router();

routerCategory.get("/category", getAllCategory)
routerCategory.get("/category/delete", getAllDelete)
routerCategory.get("/category/:id", getCategoryById)
routerCategory.delete("/category/:id",checkPermission, removeCategory)
routerCategory.delete("/category/force/:id",checkPermission, removeForce)
routerCategory.post("/category",checkPermission, addCategory)
routerCategory.patch("/category/:id",checkPermission, updateCategory)
routerCategory.patch("/category/restore/:id",checkPermission, restoreCategory   )


export default routerCategory;