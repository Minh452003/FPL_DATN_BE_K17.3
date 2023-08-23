import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import routerProducts from "./routers/products.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", routerProducts);



app.listen(8088, async () => {
    await mongoose.connect(process.env.URL_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Server is running 8088");
});
