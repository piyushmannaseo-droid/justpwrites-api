import mongoose, { Schema, type Document } from "mongoose"
import type { IAdmin } from "../types/index.js"

interface IAdminDocument extends IAdmin, Document {}

const adminSchema = new Schema<IAdminDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
      instagram: String,
      youtube: String,
    },
  },
  {
    timestamps: true,
    collection: "admin",
  },
)

export const Admin = mongoose.model<IAdminDocument>("Admin", adminSchema)
