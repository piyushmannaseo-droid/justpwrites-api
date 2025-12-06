import mongoose, { Schema, type Document } from "mongoose"
import type { IPage } from "../types/index.js"

interface IPageDocument extends IPage, Document {}

const pageSchema = new Schema<IPageDocument>(
  {
    title: {
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
    content: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    pageType: {
      type: String,
      enum: ["about", "contact"],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "pages",
  },
)

pageSchema.index({ slug: 1 })

export const Page = mongoose.model<IPageDocument>("Page", pageSchema)
