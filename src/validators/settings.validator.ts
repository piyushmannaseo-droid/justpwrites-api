import { body, type ValidationChain } from "express-validator"

export const validateContactSettings = (): ValidationChain[] => [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address"),
  body("socialLinks").optional().isObject().withMessage("socialLinks must be an object"),
  body("contactMessage").optional().trim(),
]

export const validateSiteSettings = (): ValidationChain[] => [
  body("siteName").notEmpty().withMessage("Site name is required").trim(),
  body("tagline").optional().trim(),
  body("logoUrl").optional().isURL().withMessage("Invalid logo URL"),
  body("faviconUrl").optional().isURL().withMessage("Invalid favicon URL"),
  body("defaultMetaTitle").optional().trim(),
  body("defaultMetaDescription").optional().trim(),
  body("defaultOgImage").optional().isURL().withMessage("Invalid OG image URL"),
]
