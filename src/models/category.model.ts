import mongoose, { Schema, type Document } from "mongoose"
import type { ICategory } from "../types/index.js"

interface ICategoryDocument extends ICategory, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    postCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "categories",
  },
)

// Index for slug lookups
categorySchema.index({ slug: 1 })

export const Category = mongoose.model<ICategoryDocument>("Category", categorySchema)
