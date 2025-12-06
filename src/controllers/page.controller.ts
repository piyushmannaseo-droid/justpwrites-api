import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { Page } from "../models/page.model.js"
import { asyncHandler, AppError } from "../middleware/error.middleware.js"
import { slugify } from "../utils/slugify.js"
import type { ApiResponse } from "../types/index.js"

export const getAllPages = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const pages = await Page.find().sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    message: "Pages retrieved successfully",
    data: pages,
  } as ApiResponse)
})

export const getPageBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params

  const page = await Page.findOne({ slug })
  if (!page) {
    throw new AppError(404, "Page not found", "NOT_FOUND")
  }

  res.status(200).json({
    success: true,
    message: "Page retrieved successfully",
    data: page,
  } as ApiResponse)
})

export const createPage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

  const { title, content, pageType, metaTitle, metaDescription } = req.body

  // Generate slug
  const slug = slugify(title)
  const existingPage = await Page.findOne({ slug })
  if (existingPage) {
    throw new AppError(400, "Page with this title already exists", "DUPLICATE_PAGE", { field: "slug" })
  }

  const page = new Page({
    title,
    slug,
    content,
    pageType,
    metaTitle,
    metaDescription,
  })

  await page.save()

  res.status(201).json({
    success: true,
    message: "Page created successfully",
    data: page,
  } as ApiResponse)
})

export const updatePage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  const { title, content, metaTitle, metaDescription } = req.body

  const page = await Page.findById(id)
  if (!page) {
    throw new AppError(404, "Page not found", "NOT_FOUND")
  }

  if (title) page.title = title
  if (content) page.content = content
  if (metaTitle !== undefined) page.metaTitle = metaTitle
  if (metaDescription !== undefined) page.metaDescription = metaDescription

  await page.save()

  res.status(200).json({
    success: true,
    message: "Page updated successfully",
    data: page,
  } as ApiResponse)
})

export const deletePage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const page = await Page.findById(id)
  if (!page) {
    throw new AppError(404, "Page not found", "NOT_FOUND")
  }

  await Page.findByIdAndDelete(id)

  res.status(200).json({
    success: true,
    message: "Page deleted successfully",
    data: { deletedId: id },
  } as ApiResponse)
})
