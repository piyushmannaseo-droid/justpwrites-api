import { Router } from "express"
import * as settingsController from "../controllers/settings.controller.js"
import * as settingsValidator from "../validators/settings.validator.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

// Contact Settings
router.get("/contact", settingsController.getContactSettings)
router.put(
  "/contact",
  authMiddleware,
  settingsValidator.validateContactSettings(),
  settingsController.updateContactSettings,
)

// Site Settings
router.get("/site", settingsController.getSiteSettings)
router.put("/site", authMiddleware, settingsValidator.validateSiteSettings(), settingsController.updateSiteSettings)

export default router
