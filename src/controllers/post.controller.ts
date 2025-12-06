import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { Post } from "../models/post.model.js"
import { Category } from "../models/category.model.js"
import { asyncHandler, AppError } from "../middleware/error.middleware.js"
import { slugify } from "../utils/slugify.js"
import { calculateReadingTime } from "../utils/calculate-reading-time.js"
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js"
import type { ApiResponse, PaginatedResponse } from "../types/index.js"

export const getAllPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { skip, limit, page } = getPaginationParams(req.query)
  const { status, categoryId, search, sortBy } = req.query

  // Build filter
  const filter: any = {}
  if (status) {
    filter.status = status
  }
  if (categoryId) {
    filter.categoryId = categoryId
  }
  if (search) {
    filter.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }]
  }

  // Sort options
  const sortOptions: any = {}
  if (sortBy === "viewCount") {
    sortOptions.viewCount = -1
  } else if (sortBy === "publishedAt") {
    sortOptions.publishedAt = -1
  } else {
    sortOptions.createdAt = -1
  }

  const total = await Post.countDocuments(filter)
  const posts = await Post.find(filter).skip(skip).limit(limit).sort(sortOptions)

  const pagination = getPaginationInfo(total, page, limit)

  res.status(200).json({
    success: true,
    message: "Posts retrieved successfully",
    data: posts,
    pagination,
  } as PaginatedResponse)
})

export const getPostById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  // Check if id is MongoDB ID or slug
  const post = id.match(/^[0-9a-fA-F]{24}$/) ? await Post.findById(id) : await Post.findOne({ slug: id })

  if (!post) {
    throw new AppError(404, "Post not found", "NOT_FOUND")
  }

  res.status(200).json({
    success: true,
    message: "Post retrieved successfully",
    data: post,
  } as ApiResponse)
})

export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

  const {
    title,
    excerpt,
    content,
    categoryId,
    tags,
    metaTitle,
    metaDescription,
    focusKeyword,
    featuredImage,
    imageAlt,
    status,
  } = req.body

  // Verify category exists
  const category = await Category.findById(categoryId)
  if (!category) {
    throw new AppError(404, "Category not found", "NOT_FOUND")
  }

  // Generate slug
  let slug = slugify(title)
  const existingPost = await Post.findOne({ slug })
  if (existingPost) {
    // Add timestamp to slug
    slug = `${slug}-${Date.now()}`
  }

  // Calculate reading time
  const readingTime = calculateReadingTime(content)

  const post = new Post({
    title,
    slug,
    excerpt,
    content,
    categoryId,
    categoryName: category.name,
    tags: tags || [],
    metaTitle,
    metaDescription,
    focusKeyword,
    featuredImage,
    imageAlt,
    readingTime,
    status: status || "draft",
    isFeatured: false,
    viewCount: 0,
    publishedAt: status === "published" ? new Date() : null,
  })

  await post.save()

  // Increment category post count if published
  if (status === "published") {
    await Category.findByIdAndUpdate(categoryId, { $inc: { postCount: 1 } })
  }

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  } as ApiResponse)
})

export const updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  const {
    title,
    excerpt,
    content,
    categoryId,
    tags,
    metaTitle,
    metaDescription,
    focusKeyword,
    featuredImage,
    imageAlt,
  } = req.body

  const post = await Post.findById(id)
  if (!post) {
    throw new AppError(404, "Post not found", "NOT_FOUND")
  }

  // Handle category change
  if (categoryId && categoryId !== post.categoryId.toString()) {
    const newCategory = await Category.findById(categoryId)
    if (!newCategory) {
      throw new AppError(404, "Category not found", "NOT_FOUND")
    }
    post.categoryId = categoryId
    post.categoryName = newCategory.name
  }

  // Recalculate reading time if content changed
  if (content && content !== post.content) {
    post.readingTime = calculateReadingTime(content)
    post.content = content
  }

  // Update other fields
  if (title) post.title = title
  if (excerpt) post.excerpt = excerpt
  if (tags) post.tags = tags
  if (metaTitle !== undefined) post.metaTitle = metaTitle
  if (metaDescription !== undefined) post.metaDescription = metaDescription
  if (focusKeyword !== undefined) post.focusKeyword = focusKeyword
  if (featuredImage !== undefined) post.featuredImage = featuredImage
  if (imageAlt !== undefined) post.imageAlt = imageAlt

  await post.save()

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: post,
  } as ApiResponse)
})

export const deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const post = await Post.findById(id)
  if (!post) {
    throw new AppError(404, "Post not found", "NOT_FOUND")
  }

  // Decrement category post count if published
  if (post.status === "published") {
    await Category.findByIdAndUpdate(post.categoryId, { $inc: { postCount: -1 } })
  }

  await Post.findByIdAndDelete(id)

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: { deletedId: id },
  } as ApiResponse)
})

export const publishPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const { isPublished } = req.body

  const post = await Post.findById(id)
  if (!post) {
    throw new AppError(404, "Post not found", "NOT_FOUND")
  }

  const previousStatus = post.status

  if (isPublished) {
    post.status = "published"
    if (!post.publishedAt) {
      post.publishedAt = new Date()
    }
  } else {
    post.status = "draft"
    post.publishedAt = null
  }

  await post.save()

  // Update category post count
  if (previousStatus === "draft" && isPublished) {
    await Category.findByIdAndUpdate(post.categoryId, { $inc: { postCount: 1 } })
  } else if (previousStatus === "published" && !isPublished) {
    await Category.findByIdAndUpdate(post.categoryId, { $inc: { postCount: -1 } })
  }

  res.status(200).json({
    success: true,
    message: `Post ${isPublished ? "published" : "unpublished"} successfully`,
    data: post,
  } as ApiResponse)
})

export const incrementViewCount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const post = await Post.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true })

  if (!post) {
    throw new AppError(404, "Post not found", "NOT_FOUND")
  }

  res.status(200).json({
    success: true,
    message: "View count incremented",
    data: post,
  } as ApiResponse)
})

export const getFeaturedPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { skip, limit, page } = getPaginationParams(req.query)

  const total = await Post.countDocuments({
    isFeatured: true,
    status: "published",
  })

  const posts = await Post.find({
    isFeatured: true,
    status: "published",
  })
    .skip(skip)
    .limit(limit)
    .sort({ publishedAt: -1 })

  const pagination = getPaginationInfo(total, page, limit)

  res.status(200).json({
    success: true,
    message: "Featured posts retrieved successfully",
    data: posts,
    pagination,
  } as PaginatedResponse)
})

export const searchPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { skip, limit, page } = getPaginationParams(req.query)
  const { q, status, categoryId, sortBy } = req.query

  if (!q || (q as string).trim().length === 0) {
    throw new AppError(400, "Search query (q) is required and cannot be empty", "INVALID_QUERY")
  }

  const filter: any = {
    $or: [
      { title: { $regex: q, $options: "i" } },
      { excerpt: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
      { focusKeyword: { $regex: q, $options: "i" } },
    ],
  }

  // Apply optional filters
  if (status) {
    filter.status = status
  } else {
    filter.status = "published" // Default to published posts for search
  }

  if (categoryId) {
    filter.categoryId = categoryId
  }

  // Sort options
  const sortOptions: any = {}
  if (sortBy === "viewCount") {
    sortOptions.viewCount = -1
  } else if (sortBy === "publishedAt") {
    sortOptions.publishedAt = -1
  } else {
    sortOptions.createdAt = -1
  }

  const total = await Post.countDocuments(filter)
  const posts = await Post.find(filter).skip(skip).limit(limit).sort(sortOptions)

  const pagination = getPaginationInfo(total, page, limit)

  res.status(200).json({
    success: true,
    message: `Found ${total} post(s) matching "${q}"`,
    data: posts,
    pagination,
  } as PaginatedResponse)
})
