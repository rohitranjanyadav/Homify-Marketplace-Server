import "reflect-metadata";
import express from "express";
import "./database/connection.ts";
import userRoute from "./routes/userRoute.ts";
import categoryRoute from "./routes/categoryRoute.ts";
import productRoute from "./routes/productRoute.ts";
import orderRoute from "./routes/orderRoute.ts";
import cartRoute from "./routes/cartRoute.ts";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, token",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);

app.use(express.static("./src/uploads"));

export default app;
