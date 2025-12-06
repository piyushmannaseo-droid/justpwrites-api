import mongoose, { Schema, type Document } from "mongoose"
import type { ISiteSettings } from "../types/index.js"

interface ISiteSettingsDocument extends ISiteSettings, Document {}

const siteSettingsSchema = new Schema<ISiteSettingsDocument>(
  {
    siteName: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: "",
    },
    logoUrl: {
      type: String,
      default: "",
    },
    faviconUrl: {
      type: String,
      default: "",
    },
    defaultMetaTitle: {
      type: String,
      default: "",
    },
    defaultMetaDescription: {
      type: String,
      default: "",
    },
    defaultOgImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "site_settings",
  },
)

export const SiteSettings = mongoose.model<ISiteSettingsDocument>("SiteSettings", siteSettingsSchema)
