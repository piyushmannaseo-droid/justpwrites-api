import { Router } from "express"
import * as authController from "../controllers/auth.controller.js"
import * as authValidator from "../validators/auth.validator.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

// Public routes
router.post("/login", authValidator.validateLogin(), authController.login)

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile)
router.put("/profile", authMiddleware, authValidator.validateProfileUpdate(), authController.updateProfile)

export default router
