import { Router } from "express"
import * as pageController from "../controllers/page.controller.js"
import * as pageValidator from "../validators/page.validator.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

// Public routes
router.get("/", pageController.getAllPages)
router.get("/:slug", pageController.getPageBySlug)

// Protected routes
router.post("/", authMiddleware, pageValidator.validateCreatePage(), pageController.createPage)
router.put("/:id", authMiddleware, pageValidator.validateUpdatePage(), pageController.updatePage)
router.delete("/:id", authMiddleware, pageController.deletePage)

export default router
