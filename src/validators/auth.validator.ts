import { body, type ValidationChain } from "express-validator"

export const validateLogin = (): ValidationChain[] => [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
]

export const validateProfileUpdate = (): ValidationChain[] => [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("bio").optional().trim(),
  body("avatarUrl").optional().isURL().withMessage("Invalid URL"),
  body("socialLinks").optional().isObject().withMessage("socialLinks must be an object"),
  body("socialLinks.*.twitter").optional().isURL().withMessage("Invalid URL"),
  body("socialLinks.*.linkedin").optional().isURL().withMessage("Invalid URL"),
  body("socialLinks.*.github").optional().isURL().withMessage("Invalid URL"),
  body("socialLinks.*.instagram").optional().isURL().withMessage("Invalid URL"),
  body("socialLinks.*.youtube").optional().isURL().withMessage("Invalid URL"),
]
