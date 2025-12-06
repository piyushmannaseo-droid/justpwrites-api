<div align="center">

# 📚 Justpwrites API

> A production-ready RESTful backend API for blog administration built with **Node.js**, **TypeScript**, **Express.js**, and **MongoDB**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18%2B-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure token-based authentication with bcrypt password hashing |
| 📝 **Complete CRUD** | Full CRUD operations for all 6 collections |
| 📄 **Pagination & Filtering** | Advanced filtering with optimized MongoDB queries |
| 🔗 **Auto Slug Generation** | Automatic URL-friendly slug creation from titles |
| ⏱️ **Reading Time** | Intelligent reading time estimation based on content |
| 🔍 **Advanced Search** | Full-text search across posts with multiple filters |
| 🗂️ **Denormalized Data** | Performance-optimized data structure |
| ❌ **Error Handling** | Comprehensive error management with meaningful messages |
| ✔️ **Input Validation** | Express-validator on all endpoints |
| 🎯 **TypeScript** | Full type safety and IntelliSense support |
| ⚡ **Database Indexes** | Optimized MongoDB indexes for fast queries |
| 🌐 **CORS Support** | Configured for frontend integration |

</div>

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **pnpm** 9.0.0 or higher (recommended) or npm
- **MongoDB Atlas** account ([free tier available](https://www.mongodb.com/cloud/atlas))
- **Git** for version control

---

## 🚀 Quick Start

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd justpwrites

# Install dependencies
pnpm install
```

### 2️⃣ Environment Setup

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3️⃣ Start Development Server

```bash
pnpm run dev
```

The API will be available at `http://localhost:5000`

---

## 📚 API Documentation

### Base URLs

```
Development:  http://localhost:5000/api
Production:   https://your-vercel-app.vercel.app/api
```

### Response Format

All responses follow a consistent JSON structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... }
}
```

### Authentication

Protected endpoints require JWT token in the header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔑 Authentication Endpoints

### 🔓 Login

**`POST`** `/api/auth/login`

Get JWT token for authentication.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Admin Name",
      "email": "admin@example.com",
      "bio": "Your bio here",
      "avatarUrl": "https://example.com/avatar.jpg",
      "socialLinks": {
        "twitter": "https://twitter.com/...",
        "linkedin": "https://linkedin.com/...",
        "github": "https://github.com/...",
        "instagram": "https://instagram.com/...",
        "youtube": "https://youtube.com/..."
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 👤 Get Profile

**`GET`** `/api/auth/profile` *(Protected)*

Retrieve your admin profile.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin Name",
    "email": "admin@example.com",
    "bio": "Your bio",
    "avatarUrl": "https://example.com/avatar.jpg",
    "socialLinks": { ... }
  }
}
```

---

### ✏️ Update Profile

**`PUT`** `/api/auth/profile` *(Protected)*

Update your admin profile information.

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "socialLinks": {
    "twitter": "https://twitter.com/username",
    "linkedin": "https://linkedin.com/in/username"
  }
}
```

**Response:** `200 OK`

---

## 📂 Category Endpoints

### 📋 Get All Categories

**`GET`** `/api/categories?page=1&limit=10`

Retrieve paginated list of categories.

**Query Parameters:**

| Parameter | Type   | Default | Description                    |
|-----------|--------|---------|--------------------------------|
| `page`    | number | 1       | Page number                    |
| `limit`   | number | 10      | Items per page (max: 100)     |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "SEO Tips",
      "slug": "seo-tips",
      "description": "Learn SEO best practices",
      "metaTitle": "SEO Tips",
      "metaDescription": "SEO optimization techniques",
      "postCount": 5,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 25,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 🔍 Get Category by ID or Slug

**`GET`** `/api/categories/:id`

Retrieve a single category by MongoDB ID or URL slug.

**Parameters:**
- `:id` - MongoDB ObjectId OR category slug (e.g., "seo-tips")

**Response:** `200 OK`

---

### ➕ Create Category

**`POST`** `/api/categories` *(Protected)*

Create a new category. Slug is auto-generated from name.

**Request Body:**
```json
{
  "name": "SEO Tips",
  "description": "Learn SEO best practices",
  "metaTitle": "SEO Tips - My Blog",
  "metaDescription": "Discover proven SEO techniques"
}
```

**Response:** `201 Created`

---

### ✏️ Update Category

**`PUT`** `/api/categories/:id` *(Protected)*

Update an existing category.

**Request Body:**
```json
{
  "name": "SEO Optimization",
  "description": "Advanced SEO techniques",
  "metaTitle": "SEO Optimization Guide"
}
```

**Response:** `200 OK`

---

### 🗑️ Delete Category

**`DELETE`** `/api/categories/:id` *(Protected)*

Delete a category and cascade update associated posts.

**Response:** `200 OK`

---

### 📄 Get Category with Posts

**`GET`** `/api/categories/:id/posts?page=1&limit=10`

Retrieve category details with its published posts.

**Response:** `200 OK`

---

## 📝 Post Endpoints

### 📋 Get All Posts

**`GET`** `/api/posts?page=1&limit=10&status=published&search=keyword&sortBy=publishedAt`

Retrieve posts with advanced filtering, searching, and sorting.

**Query Parameters:**

| Parameter    | Type   | Options                          | Description                    |
|--------------|--------|----------------------------------|--------------------------------|
| `page`       | number |                                  | Page number (default: 1)       |
| `limit`      | number |                                  | Items per page (default: 10, max: 100) |
| `status`     | string  | `draft`, `published`             | Filter by status              |
| `categoryId` | string  |                                  | Filter by category ObjectId    |
| `search`     | string  |                                  | Search in title and content   |
| `sortBy`     | string  | `publishedAt`, `createdAt`, `viewCount` | Sort order |

**Response:** `200 OK` (includes pagination)

---

### 📄 Get Post by ID or Slug

**`GET`** `/api/posts/:id`

Retrieve a single post by MongoDB ID or URL slug.

**Response:** `200 OK`

---

### ➕ Create Post

**`POST`** `/api/posts` *(Protected)*

Create a new post with auto-generated slug and reading time.

**Request Body:**
```json
{
  "title": "SEO Best Practices for 2024",
  "excerpt": "Learn the latest SEO techniques",
  "content": "<h1>Introduction</h1><p>Content in HTML or Markdown...</p>",
  "categoryId": "507f1f77bcf86cd799439011",
  "tags": ["seo", "optimization", "2024"],
  "metaTitle": "SEO Best Practices 2024",
  "metaDescription": "Comprehensive guide to SEO",
  "focusKeyword": "SEO practices",
  "featuredImage": "https://example.com/image.jpg",
  "imageAlt": "SEO optimization",
  "status": "draft"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "SEO Best Practices for 2024",
    "slug": "seo-best-practices-for-2024",
    "categoryName": "SEO Tips",
    "readingTime": 8,
    "status": "draft",
    "viewCount": 0
  }
}
```

---

### ✏️ Update Post

**`PUT`** `/api/posts/:id` *(Protected)*

Update post (reading time auto-recalculated if content changes).

**Request Body:** Same as create (all fields optional)

**Response:** `200 OK`

---

### 🗑️ Delete Post

**`DELETE`** `/api/posts/:id` *(Protected)*

Delete a post and decrement category postCount.

**Response:** `200 OK`

---

### 📤 Publish/Unpublish Post

**`PATCH`** `/api/posts/:id/publish` *(Protected)*

Toggle post between draft and published status.

**Request Body:**
```json
{
  "isPublished": true
}
```

**Response:** `200 OK`

---

### 👁️ Increment View Count

**`PATCH`** `/api/posts/:id/views`

Record a post view for analytics.

**Response:** `200 OK`

---

### ⭐ Get Featured Posts

**`GET`** `/api/posts/featured?page=1&limit=10`

Retrieve featured posts only.

**Response:** `200 OK`

---

## 🗂️ Page Endpoints

### 📋 Get All Pages

**`GET`** `/api/pages`

Retrieve all pages (About, Contact, etc.).

**Response:** `200 OK`

---

### 📄 Get Page by Slug

**`GET`** `/api/pages/:slug`

Retrieve a single page by slug.

**Response:** `200 OK`

---

### ➕ Create Page

**`POST`** `/api/pages` *(Protected)*

Create a new page with auto-generated slug.

**Request Body:**
```json
{
  "title": "About Me",
  "content": "<h1>About</h1><p>About page content...</p>",
  "pageType": "about",
  "metaTitle": "About Me",
  "metaDescription": "Learn about the author"
}
```

**Response:** `201 Created`

---

### ✏️ Update Page

**`PUT`** `/api/pages/:id` *(Protected)*

Update page content.

**Response:** `200 OK`

---

### 🗑️ Delete Page

**`DELETE`** `/api/pages/:id` *(Protected)*

Delete a page.

**Response:** `200 OK`

---

## ⚙️ Settings Endpoints

### 📧 Get Contact Settings

**`GET`** `/api/settings/contact`

Retrieve contact settings (public endpoint).

**Response:** `200 OK`

---

### ✏️ Update Contact Settings

**`PUT`** `/api/settings/contact` *(Protected)*

Update contact information and social links.

**Request Body:**
```json
{
  "email": "contact@example.com",
  "socialLinks": {
    "twitter": "https://twitter.com/username",
    "linkedin": "https://linkedin.com/in/username",
    "instagram": "https://instagram.com/username",
    "youtube": "https://youtube.com/c/channel",
    "facebook": "https://facebook.com/username"
  },
  "contactMessage": "Thank you for reaching out!"
}
```

**Response:** `200 OK`

---

### 🌐 Get Site Settings

**`GET`** `/api/settings/site`

Retrieve site configuration (public endpoint).

**Response:** `200 OK`

---

### ✏️ Update Site Settings

**`PUT`** `/api/settings/site` *(Protected)*

Update site branding and metadata.

**Request Body:**
```json
{
  "siteName": "My Awesome Blog",
  "tagline": "Tips for SEO, AI, and Productivity",
  "logoUrl": "https://example.com/logo.png",
  "faviconUrl": "https://example.com/favicon.ico",
  "defaultMetaTitle": "My Awesome Blog",
  "defaultMetaDescription": "Learn SEO, AI tools, and productivity tips",
  "defaultOgImage": "https://example.com/og-image.jpg"
}
```

**Response:** `200 OK`

---

## ❌ Error Responses

### Validation Error

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "msg": "Invalid email address",
        "param": "email",
        "location": "body"
      }
    ]
  }
}
```

---

### Unauthorized

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "Token verification failed"
  }
}
```

---

### Not Found

**Status:** `404 Not Found`

```json
{
  "success": false,
  "message": "Resource not found",
  "error": {
    "code": "NOT_FOUND"
  }
}
```

---

### Server Error

**Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Internal server error",
  "error": {
    "code": "INTERNAL_ERROR"
  }
}
```

---

## 🗄️ Database Schema

### Admin Collection

```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (bcrypt hashed),
  bio: string,
  avatarUrl: string,
  socialLinks: {
    twitter?: string,
    linkedin?: string,
    github?: string,
    instagram?: string,
    youtube?: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection

```typescript
{
  _id: ObjectId,
  name: string,
  slug: string (unique, indexed),
  description: string,
  metaTitle: string,
  metaDescription: string,
  postCount: number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Posts Collection

```typescript
{
  _id: ObjectId,
  title: string,
  slug: string (unique, indexed),
  excerpt: string,
  content: string (HTML/Markdown),
  featuredImage: string,
  imageAlt: string,
  categoryId: ObjectId (indexed),
  categoryName: string (denormalized),
  tags: string[] (indexed),
  metaTitle: string,
  metaDescription: string,
  focusKeyword: string,
  readingTime: number,
  status: 'draft' | 'published' (indexed),
  isFeatured: boolean (default: false),
  viewCount: number (default: 0),
  publishedAt: Date (indexed),
  createdAt: Date,
  updatedAt: Date
}
```

### Pages Collection

```typescript
{
  _id: ObjectId,
  title: string,
  slug: string (unique, indexed),
  content: string,
  metaTitle: string,
  metaDescription: string,
  pageType: 'about' | 'contact',
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Settings Collection

```typescript
{
  _id: ObjectId,
  email: string,
  socialLinks: {
    twitter?: string,
    linkedin?: string,
    instagram?: string,
    youtube?: string,
    facebook?: string
  },
  contactMessage: string,
  updatedAt: Date
}
```

### Site Settings Collection

```typescript
{
  _id: ObjectId,
  siteName: string,
  tagline: string,
  logoUrl: string,
  faviconUrl: string,
  defaultMetaTitle: string,
  defaultMetaDescription: string,
  defaultOgImage: string,
  updatedAt: Date
}
```

---

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from `.env`:
     - `MONGODB_URI`
     - `JWT_SECRET` (use a strong, random value)
     - `NODE_ENV=production`
     - `ALLOWED_ORIGINS` (your frontend domains)

4. **Deploy**
   - Click "Deploy"

### Local Production Testing

```bash
pnpm run build
pnpm run start
```

---

## 🔒 Security Best Practices

<div align="center">

| Security Feature | Implementation |
|------------------|----------------|
| ✅ Password Hashing | bcrypt with 10 salt rounds |
| ✅ JWT Tokens | 7-day expiration |
| ✅ CORS | Configured for specified origins only |
| ✅ Input Validation | Express-validator on all endpoints |
| ✅ MongoDB Indexes | Query optimization |
| ✅ Environment Variables | All sensitive data in `.env` |
| ✅ HTTPS | Enforced in production |
| ✅ SQL Injection Protection | Mongoose ODM |
| ✅ XSS Protection | Input sanitization |

</div>

---

## ⚡ Performance

<div align="center">

| Optimization | Description |
|--------------|-------------|
| 📊 Pagination | Max 100 items per page |
| 🗂️ Compound Indexes | MongoDB indexes on frequently queried fields |
| 📄 Denormalized Data | Reduces database lookups |
| 🔍 Indexed Slug Lookups | Fast searches |
| 📈 Auto-maintained Counts | Category post counts |
| 💾 Efficient Filtering | Optimized query filtering and sorting |

</div>

---

## 📦 Available Scripts

```bash
# Development
pnpm run dev         # Start with hot reload

# Production
pnpm run build      # Build TypeScript to dist/
pnpm run start      # Start from dist/
pnpm run type-check # TypeScript type checking
```

---

## 📂 Project Structure

```
src/
├── server.ts                    # Express app entry point
├── config/
│   └── database.ts             # MongoDB connection
├── models/
│   ├── admin.model.ts
│   ├── category.model.ts
│   ├── post.model.ts
│   ├── page.model.ts
│   ├── contact-settings.model.ts
│   └── site-settings.model.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── category.controller.ts
│   ├── post.controller.ts
│   ├── page.controller.ts
│   └── settings.controller.ts
├── routes/
│   ├── auth.routes.ts
│   ├── category.routes.ts
│   ├── post.routes.ts
│   ├── page.routes.ts
│   └── settings.routes.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── validators/
│   ├── auth.validator.ts
│   ├── category.validator.ts
│   ├── post.validator.ts
│   ├── page.validator.ts
│   └── settings.validator.ts
├── utils/
│   ├── slugify.ts
│   ├── calculate-reading-time.ts
│   └── pagination.ts
└── types/
    └── index.ts                 # TypeScript interfaces
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network access is enabled

### JWT Token Expiration

- Tokens expire in 7 days
- Login again to get a new token
- Check token format in Authorization header

### CORS Issues

- Add frontend URL to `ALLOWED_ORIGINS` in `.env`
- Ensure format: `http://localhost:3000,https://myapp.com`

### Slug Conflicts

- Slugs are unique per collection
- Manually edit slug if auto-generation conflicts

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 💬 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing documentation
- Review error messages carefully

---

## 🙌 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ for blog administrators**

[⬆ Back to Top](#-justpwrites-api)

</div>
