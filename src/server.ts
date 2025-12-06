import express, { type Express, type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/database.js"
import { errorHandler } from "./middleware/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import categoryRoutes from "./routes/category.routes.js"
import postRoutes from "./routes/post.routes.js"
import pageRoutes from "./routes/page.routes.js"
import settingsRoutes from "./routes/settings.routes.js"

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000

// Database connection
connectDB()

// Middleware
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",")
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/pages", pageRoutes)
app.use("/api/settings", settingsRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: {
      code: "ROUTE_NOT_FOUND",
      details: `${req.method} ${req.path} not found`,
    },
  })
})

// Global error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
