import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import routerProducts from "./routers/products.js";
import routerBrands from "./routers/brands.js";
import routerStatus from "./routers/status.js";
import routerComment from "./routers/comments.js";
import routerUser from "./routers/user.js";
import routerCategory from "./routers/category.js";
import uploadRouter from "./routers/upload.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", routerProducts);
app.use("/api", routerCategory);
app.use("/api", routerBrands);
app.use("/api", routerStatus);
app.use("/api", routerComment);
app.use("/api", routerUser)
app.use("/api", uploadRouter);


app.listen(8088, async () => {
    await mongoose.connect(process.env.URL_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Server is running 8088");
});
