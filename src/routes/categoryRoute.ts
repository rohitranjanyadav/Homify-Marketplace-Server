import express, { Router } from "express";
import categoryController from "../controllers/categoryController.ts";
import userMiddleware, { Role } from "../middleware/userMiddleware.ts";
import errorHandler from "../services/errorHandler.ts";

const router: Router = express.Router();

router
  .route("/")
  .get(errorHandler(categoryController.getCategories))
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(categoryController.addCategory),
  );

router
  .route("/:id")
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(categoryController.updateCategory),
  )
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(categoryController.deleteCategory),
  );

export default router;
