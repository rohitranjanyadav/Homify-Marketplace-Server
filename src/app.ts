import "reflect-metadata";
import express from "express";
import "./database/connection.ts";
import userRoute from "./routes/userRoute.ts";
import categoryRoute from "./routes/categoryRoute.ts";
import productRoute from "./routes/productRoute.ts";
import orderRoute from "./routes/orderRoute.ts"

const app = express();
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute)

export default app;
