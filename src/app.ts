import express from "express";
import "./database/connection.ts";
import userRoute from "./routes/userRoute.ts";

const app = express();
app.use(express.json());

app.use("/api/auth", userRoute);

export default app;
