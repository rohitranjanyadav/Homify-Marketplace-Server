import express, { Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware.ts";
import productController from "../controllers/productController.ts";
import { multer, storage } from "../middleware/multerMiddleware.ts";
import errorHandler from "../services/errorHandler.ts";

const upload = multer({ storage: storage });

const router: Router = express.Router();

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    upload.single("productImage"),
    errorHandler(productController.createProduct),
  )
  .get(errorHandler(productController.getAllProducts));

router
  .route("/:id")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(productController.deleteProduct),
  )
  .get(productController.getSingleProduct)
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(productController.deleteProduct),
  );

export default router;
