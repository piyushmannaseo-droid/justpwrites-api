import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { Admin } from "../models/admin.model.js"
import { asyncHandler, AppError } from "../middleware/error.middleware.js"
import type { ApiResponse } from "../types/index.js"

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

  const { email, password } = req.body

  // Find admin by email
  const admin = await Admin.findOne({ email: email.toLowerCase() })
  if (!admin) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS")
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, admin.password)
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS")
  }

  // Generate JWT token
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new AppError(500, "JWT configuration error", "CONFIG_ERROR")
  }

  const token = jwt.sign({ adminId: admin._id, email: admin.email }, jwtSecret, { expiresIn: "7d" })

  const adminData = admin.toObject()
  delete (adminData as any).password

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      admin: adminData,
      token,
    },
  } as ApiResponse)
})

export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.admin) {
    throw new AppError(401, "Unauthorized", "UNAUTHORIZED")
  }

  const admin = await Admin.findById(req.admin.adminId)
  if (!admin) {
    throw new AppError(404, "Admin not found", "NOT_FOUND")
  }

  const adminData = admin.toObject()
  delete (adminData as any).password

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: adminData,
  } as ApiResponse)
})

export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

  if (!req.admin) {
    throw new AppError(401, "Unauthorized", "UNAUTHORIZED")
  }

  const { name, bio, avatarUrl, socialLinks } = req.body

  const admin = await Admin.findByIdAndUpdate(
    req.admin.adminId,
    {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(socialLinks && { socialLinks }),
    },
    { new: true, runValidators: true },
  )

  if (!admin) {
    throw new AppError(404, "Admin not found", "NOT_FOUND")
  }

  const adminData = admin.toObject()
  delete (adminData as any).password

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: adminData,
  } as ApiResponse)
})
