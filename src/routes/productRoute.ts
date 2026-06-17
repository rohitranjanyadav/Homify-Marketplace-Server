import express, { Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware.ts";
import productController from "../controllers/productController.ts";
import { multer, storage } from "../middleware/multerMiddleware.ts";

const upload = multer({ storage: storage });

const router: Router = express.Router();

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    upload.single("productImage"),
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
  .get(productController.getSingleProduct)
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    productController.deleteProduct,
  );

export default router;
