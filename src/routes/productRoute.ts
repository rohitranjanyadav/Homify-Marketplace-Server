import express, { Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware.ts";
import productController from "../controllers/productController.ts";

const router: Router = express.Router();

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    productController.createProduct,
  )
  .get(productController.getAllProducts);
router
  .route("/:id")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    productController.deleteProduct,
  )
  .get(productController.getSingleProduct);

export default router;
