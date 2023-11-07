import express from 'express';
import { addNew, getAllDelete, getNewById, getNews, removeForceNew, removeNew, restoreNew, updateNew } from "../controllers/news.js";
import { authorization } from '../middlewares/authorization.js';
import { authenticate } from '../middlewares/authenticate.js';

const routerNews = express.Router();


routerNews.get("/news", getNews);
routerNews.get("/news/delete", getAllDelete);
routerNews.get("/news/:id", getNewById);
routerNews.delete("/news/:id", authenticate, authorization, removeNew);
routerNews.delete("/news/force/:id", authenticate, authorization, removeForceNew);
routerNews.post("/news", authenticate, authorization, addNew);
routerNews.patch("/news/:id", authenticate, authorization, updateNew);
routerNews.patch("/news/restore/:id", authenticate, authorization, restoreNew);
export default routerNews;