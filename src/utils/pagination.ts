import type { PaginationInfo } from "../types/index.js"

export interface PaginationParams {
  page?: number
  limit?: number
}

export const getPaginationParams = (query: any): { skip: number; limit: number; page: number } => {
  const page = Math.max(1, Number.parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit) || 10))
  const skip = (page - 1) * limit

  return { skip, limit, page }
}

export const getPaginationInfo = (total: number, page: number, limit: number): PaginationInfo => {
  const totalPages = Math.ceil(total / limit)
  return {
    currentPage: page,
    totalPages,
    totalCount: total,
    limit,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
