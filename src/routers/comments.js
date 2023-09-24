import express from "express";
import { create, getAllComment, getCommentFromProduct, getOneComment, removeCommentByAdmin, removeCommentByUser, updateComment } from "../controllers/comments.js";
import { authorization } from "../middlewares/authorization.js";
import { authenticate } from "../middlewares/authenticate.js";

const routerComment = express.Router();

routerComment.get("/comment/:productId", getCommentFromProduct);
routerComment.get("/comment/:id/detail", getOneComment);
routerComment.get("/comment", getAllComment)
routerComment.delete("/comments/:id/remove", removeCommentByUser);
routerComment.delete("/comment/:id/admin", authenticate, authorization, removeCommentByAdmin);
routerComment.post("/comment", create);
routerComment.patch("/comment/:id", updateComment);


export default routerComment;