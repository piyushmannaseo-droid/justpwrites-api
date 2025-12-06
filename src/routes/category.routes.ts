import { Router } from "express"
import * as categoryController from "../controllers/category.controller.js"
import * as categoryValidator from "../validators/category.validator.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

// Public routes
router.get("/", categoryController.getAllCategories)
router.get("/:id", categoryController.getCategoryById)
router.get("/:id/posts", categoryController.getCategoryWithPosts)

// Protected routes
router.post("/", authMiddleware, categoryValidator.validateCreateCategory(), categoryController.createCategory)
router.put("/:id", authMiddleware, categoryValidator.validateUpdateCategory(), categoryController.updateCategory)
router.delete("/:id", authMiddleware, categoryController.deleteCategory)

export default router
