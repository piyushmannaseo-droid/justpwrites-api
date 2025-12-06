import mongoose, { Schema, type Document } from "mongoose"
import type { IContactSettings } from "../types/index.js"

interface IContactSettingsDocument extends IContactSettings, Document {}

const contactSettingsSchema = new Schema<IContactSettingsDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      instagram: String,
      youtube: String,
      facebook: String,
    },
    contactMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "contact_settings",
  },
)

export const ContactSettings = mongoose.model<IContactSettingsDocument>("ContactSettings", contactSettingsSchema)
