import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { Category } from "../models/category.model.js"
import { Post } from "../models/post.model.js"
import { asyncHandler, AppError } from "../middleware/error.middleware.js"
import { slugify } from "../utils/slugify.js"
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js"
import type { ApiResponse, PaginatedResponse } from "../types/index.js"

export const getAllCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { skip, limit, page } = getPaginationParams(req.query)

  const total = await Category.countDocuments()
  const categories = await Category.find().skip(skip).limit(limit).sort({ createdAt: -1 })

  const pagination = getPaginationInfo(total, page, limit)

  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
    pagination,
  } as PaginatedResponse)
})

export const getCategoryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  // Check if id is a valid MongoDB ID or slug
  const category = id.match(/^[0-9a-fA-F]{24}$/) ? await Category.findById(id) : await Category.findOne({ slug: id })

  if (!category) {
    throw new AppError(404, "Category not found", "NOT_FOUND")
  }

  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    data: category,
  } as ApiResponse)
})

export const createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      error: {
        code: "VALIDATION_ERROR",
        details: errors.array(),
      },
    })
    return
  }

  const { name, description, metaTitle, metaDescription } = req.body

  // Generate slug
  const slug = slugify(name)

  // Check for unique slug
  const existingCategory = await Category.findOne({ slug })
  if (existingCategory) {
    throw new AppError(400, "Category with this name already exists", "DUPLICATE_CATEGORY", { field: "slug" })
  }

  const category = new Category({
    name,
    slug,
    description,
    metaTitle,
    metaDescription,
    postCount: 0,
  })

  await category.save()

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  } as ApiResponse)
})

export const updateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      error: {
        code: "VALIDATION_ERROR",
        details: errors.array(),
      },
    })
    return
  }

  const { id } = req.params
  const { name, description, metaTitle, metaDescription } = req.body

  const category = await Category.findById(id)
  if (!category) {
    throw new AppError(404, "Category not found", "NOT_FOUND")
  }

  // Update slug if name changed
  if (name && name !== category.name) {
    const newSlug = slugify(name)
    const existingCategory = await Category.findOne({
      slug: newSlug,
      _id: { $ne: id },
    })
    if (existingCategory) {
      throw new AppError(400, "Category with this name already exists", "DUPLICATE_CATEGORY", { field: "slug" })
    }
    category.slug = newSlug
    category.name = name
  }

  if (description !== undefined) category.description = description
  if (metaTitle !== undefined) category.metaTitle = metaTitle
  if (metaDescription !== undefined) category.metaDescription = metaDescription

  await category.save()

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  } as ApiResponse)
})

export const deleteCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const category = await Category.findById(id)
  if (!category) {
    throw new AppError(404, "Category not found", "NOT_FOUND")
  }

  // Update all posts in this category to have no category
  await Post.updateMany({ categoryId: id }, { categoryId: null, categoryName: "" })

  await Category.findByIdAndDelete(id)

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: { deletedId: id },
  } as ApiResponse)
})

export const getCategoryWithPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const { skip, limit, page } = getPaginationParams(req.query)

  const category = await Category.findById(id)
  if (!category) {
    throw new AppError(404, "Category not found", "NOT_FOUND")
  }

  const total = await Post.countDocuments({
    categoryId: id,
    status: "published",
  })

  const posts = await Post.find({
    categoryId: id,
    status: "published",
  })
    .skip(skip)
    .limit(limit)
    .sort({ publishedAt: -1 })

  const pagination = getPaginationInfo(total, page, limit)

  res.status(200).json({
    success: true,
    message: "Category with posts retrieved successfully",
    data: {
      category,
      posts,
    },
    pagination,
  } as PaginatedResponse)
})
