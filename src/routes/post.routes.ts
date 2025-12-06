import { Router } from "express"
import * as postController from "../controllers/post.controller.js"
import * as postValidator from "../validators/post.validator.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

// Public routes
router.get("/", postController.getAllPosts)
router.get("/featured", postController.getFeaturedPosts)
router.get("/:id", postController.getPostById)
router.patch("/:id/views", postController.incrementViewCount)

// Dedicated search endpoint
router.get("/search/posts", postController.searchPosts)

// Protected routes
router.post("/", authMiddleware, postValidator.validateCreatePost(), postController.createPost)
router.put("/:id", authMiddleware, postValidator.validateUpdatePost(), postController.updatePost)
router.delete("/:id", authMiddleware, postController.deletePost)
router.patch("/:id/publish", authMiddleware, postController.publishPost)

export default router
