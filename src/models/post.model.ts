import mongoose, { Schema, type Document } from "mongoose"
import type { IPost } from "../types/index.js"

interface IPostDocument extends IPost, Document {}

const postSchema = new Schema<IPostDocument>(
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
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      default: "",
    },
    imageAlt: {
      type: String,
      default: "",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    categoryName: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    focusKeyword: {
      type: String,
      default: "",
    },
    readingTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "posts",
  },
)

// Compound index for efficient querying
postSchema.index({ status: 1, publishedAt: -1 })
postSchema.index({ categoryId: 1 })
postSchema.index({ tags: 1 })

export const Post = mongoose.model<IPostDocument>("Post", postSchema)
