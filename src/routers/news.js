import express from 'express';
import { createNews, getNewByOneId, getNewList, removeNews, updateNews } from "../controllers/news.js";

const routerNews = express.Router();

routerNews.post('/news', createNews);
routerNews.get('/news', getNewList);
routerNews.patch("/news/:id", updateNews);
routerNews.get("/news/:id", getNewByOneId);
routerNews.delete("/news/:id", removeNews);
export default routerNews;