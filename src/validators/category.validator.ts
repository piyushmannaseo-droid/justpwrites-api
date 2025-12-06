import { body, type ValidationChain } from "express-validator"

export const validateCreateCategory = (): ValidationChain[] => [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters"),
  body("description").optional().trim(),
  body("metaTitle").optional().trim(),
  body("metaDescription").optional().trim(),
]

export const validateUpdateCategory = (): ValidationChain[] => [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Category name must be at least 2 characters"),
  body("description").optional().trim(),
  body("metaTitle").optional().trim(),
  body("metaDescription").optional().trim(),
]
