// Admin Types
export interface IAdmin {
  _id?: string
  name: string
  email: string
  password: string
  bio?: string
  avatarUrl?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    instagram?: string
    youtube?: string
  }
  createdAt?: Date
  updatedAt?: Date
}

// Category Types
export interface ICategory {
  _id?: string
  name: string
  slug: string
  description?: string
  metaTitle?: string
  metaDescription?: string
  postCount: number
  createdAt?: Date
  updatedAt?: Date
}

// Post Types
export interface IPost {
  _id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  imageAlt?: string
  categoryId: string
  categoryName: string
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  readingTime: number
  status: "draft" | "published"
  isFeatured: boolean
  viewCount: number
  publishedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

// Page Types
export interface IPage {
  _id?: string
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDescription?: string
  pageType: "about" | "contact"
  createdAt?: Date
  updatedAt?: Date
}

// Contact Settings Types
export interface IContactSettings {
  _id?: string
  email: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    instagram?: string
    youtube?: string
    facebook?: string
  }
  contactMessage?: string
  updatedAt?: Date
}

// Site Settings Types
export interface ISiteSettings {
  _id?: string
  siteName: string
  tagline?: string
  logoUrl?: string
  faviconUrl?: string
  defaultMetaTitle?: string
  defaultMetaDescription?: string
  defaultOgImage?: string
  updatedAt?: Date
}

// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: any
  }
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> extends ApiResponse {
  data?: T[]
  pagination?: PaginationInfo
}

export interface JwtPayload {
  adminId: string
  email: string
}

// Request validation schemas
export interface LoginRequest {
  email: string
  password: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  metaTitle?: string
  metaDescription?: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  metaTitle?: string
  metaDescription?: string
}

export interface CreatePostRequest {
  title: string
  excerpt: string
  content: string
  categoryId: string
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  featuredImage?: string
  imageAlt?: string
  status?: "draft" | "published"
}

export interface UpdatePostRequest {
  title?: string
  excerpt?: string
  content?: string
  categoryId?: string
  categoryName?: string
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  featuredImage?: string
  imageAlt?: string
}

export interface CreatePageRequest {
  title: string
  content: string
  pageType: "about" | "contact"
  metaTitle?: string
  metaDescription?: string
}

export interface UpdatePageRequest {
  title?: string
  content?: string
  metaTitle?: string
  metaDescription?: string
}
