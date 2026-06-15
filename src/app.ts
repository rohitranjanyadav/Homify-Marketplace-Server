import "reflect-metadata";
import express from "express";
import "./database/connection.ts";
import userRoute from "./routes/userRoute.ts";
import categoryRoute from "./routes/categoryRoute.ts";
import productRoute from "./routes/productRoute.ts";

const app = express();
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);

export default app;
