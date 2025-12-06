import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import type { JwtPayload } from "../types/index.js"

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Missing or invalid authorization header",
        error: {
          code: "UNAUTHORIZED",
          details: "Token not provided",
        },
      })
      return
    }

    const token = authHeader.substring(7)
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error("JWT_SECRET not configured")
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload
    req.admin = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: {
        code: "UNAUTHORIZED",
        details: error instanceof Error ? error.message : "Invalid token",
      },
    })
  }
}
