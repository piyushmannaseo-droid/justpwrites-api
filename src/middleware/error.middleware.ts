import type { Request, Response, NextFunction } from "express"
import type { ApiResponse } from "../types/index.js"

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code = "INTERNAL_ERROR",
    public details?: any,
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (error: Error | AppError, _req: Request, res: Response, _next: NextFunction): void => {
  console.error("Error:", error)

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: {
        code: error.code,
        details: error.details,
      },
    } as ApiResponse)
  } else {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        code: "INTERNAL_ERROR",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
    } as ApiResponse)
  }
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
