import { body, type ValidationChain } from "express-validator"

export const validateCreatePost = (): ValidationChain[] => [
  body("title")
    .notEmpty()
    .withMessage("Post title is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Post title must be at least 3 characters"),
  body("excerpt").notEmpty().withMessage("Post excerpt is required").trim(),
  body("content").notEmpty().withMessage("Post content is required"),
  body("categoryId").notEmpty().withMessage("Category ID is required").isMongoId().withMessage("Invalid category ID"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("metaTitle").optional().trim(),
  body("metaDescription").optional().trim(),
  body("focusKeyword").optional().trim(),
  body("featuredImage").optional().isURL().withMessage("Invalid image URL"),
  body("imageAlt").optional().trim(),
  body("status").optional().isIn(["draft", "published"]).withMessage("Status must be draft or published"),
]

export const validateUpdatePost = (): ValidationChain[] => [
  body("title").optional().trim().isLength({ min: 3 }).withMessage("Post title must be at least 3 characters"),
  body("excerpt").optional().trim(),
  body("content").optional(),
  body("categoryId").optional().isMongoId().withMessage("Invalid category ID"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("metaTitle").optional().trim(),
  body("metaDescription").optional().trim(),
  body("focusKeyword").optional().trim(),
  body("featuredImage").optional().isURL().withMessage("Invalid image URL"),
  body("imageAlt").optional().trim(),
]
