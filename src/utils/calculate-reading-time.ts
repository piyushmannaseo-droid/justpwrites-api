export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, "")
  // Count words
  const wordCount = plainText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  // Calculate reading time
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, readingTime) // Minimum 1 minute
}
