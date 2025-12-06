import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { ContactSettings } from "../models/contact-settings.model.js"
import { SiteSettings } from "../models/site-settings.model.js"
import { asyncHandler } from "../middleware/error.middleware.js"
import type { ApiResponse } from "../types/index.js"

export const getContactSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  let settings = await ContactSettings.findOne()

  if (!settings) {
    settings = new ContactSettings({
      email: "admin@example.com",
      socialLinks: {},
    })
    await settings.save()
  }

  res.status(200).json({
    success: true,
    message: "Contact settings retrieved successfully",
    data: settings,
  } as ApiResponse)
})

export const updateContactSettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

  const { email, socialLinks, contactMessage } = req.body

  let settings = await ContactSettings.findOne()

  if (!settings) {
    settings = new ContactSettings({
      email,
      socialLinks,
      contactMessage,
    })
  } else {
    if (email) settings.email = email
    if (socialLinks) settings.socialLinks = socialLinks
    if (contactMessage !== undefined) settings.contactMessage = contactMessage
  }

  await settings.save()

  res.status(200).json({
    success: true,
    message: "Contact settings updated successfully",
    data: settings,
  } as ApiResponse)
})

export const getSiteSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  let settings = await SiteSettings.findOne()

  if (!settings) {
    settings = new SiteSettings({
      siteName: "My Blog",
    })
    await settings.save()
  }

  res.status(200).json({
    success: true,
    message: "Site settings retrieved successfully",
    data: settings,
  } as ApiResponse)
})

export const updateSiteSettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

  const { siteName, tagline, logoUrl, faviconUrl, defaultMetaTitle, defaultMetaDescription, defaultOgImage } = req.body

  let settings = await SiteSettings.findOne()

  if (!settings) {
    settings = new SiteSettings({
      siteName,
      tagline,
      logoUrl,
      faviconUrl,
      defaultMetaTitle,
      defaultMetaDescription,
      defaultOgImage,
    })
  } else {
    if (siteName) settings.siteName = siteName
    if (tagline !== undefined) settings.tagline = tagline
    if (logoUrl !== undefined) settings.logoUrl = logoUrl
    if (faviconUrl !== undefined) settings.faviconUrl = faviconUrl
    if (defaultMetaTitle !== undefined) settings.defaultMetaTitle = defaultMetaTitle
    if (defaultMetaDescription !== undefined) settings.defaultMetaDescription = defaultMetaDescription
    if (defaultOgImage !== undefined) settings.defaultOgImage = defaultOgImage
  }

  await settings.save()

  res.status(200).json({
    success: true,
    message: "Site settings updated successfully",
    data: settings,
  } as ApiResponse)
})
