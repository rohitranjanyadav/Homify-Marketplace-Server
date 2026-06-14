import express, { Router } from "express";
import categoryController from "../controllers/categoryController.ts";
import userMiddleware from "../middleware/userMiddleware.ts";

const router: Router = express.Router();

router
  .route("/")
  .get(categoryController.getCategories)
  .post(userMiddleware.isUserLoggedIn, categoryController.addCategory);

router
  .route("/:id")
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
