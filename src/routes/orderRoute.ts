import express, { Router } from "express";
import userMiddleware from "../middleware/userMiddleware.ts";
import orderController from "../controllers/orderController.ts";
import errorHandler from "../services/errorHandler.ts";

const router: Router = express.Router();

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.createOrder),
  );

router
  .route("/verify-pidx")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.verifyTransaction),
  );
export default router;
