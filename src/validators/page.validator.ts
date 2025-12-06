import { body, type ValidationChain } from "express-validator"

export const validateCreatePage = (): ValidationChain[] => [
  body("title")
    .notEmpty()
    .withMessage("Page title is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Page title must be at least 3 characters"),
  body("content").notEmpty().withMessage("Page content is required"),
  body("pageType")
    .notEmpty()
    .withMessage("Page type is required")
    .isIn(["about", "contact"])
    .withMessage("Page type must be about or contact"),
  body("metaTitle").optional().trim(),
  body("metaDescription").optional().trim(),
]

export const validateUpdatePage = (): ValidationChain[] => [
  body("title").optional().trim().isLength({ min: 3 }).withMessage("Page title must be at least 3 characters"),
  body("content").optional(),
  body("metaTitle").optional().trim(),
  body("metaDescription").optional().trim(),
]
