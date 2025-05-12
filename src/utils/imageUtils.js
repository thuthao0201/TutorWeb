/**
 * Formats image URLs to ensure they have the correct base URL
 * This handles both relative paths (like /uploads/default-avatar.png)
 * and absolute URLs (like https://example.com/image.jpg)
 *
 * @param {string} imagePath - The image path from the API
 * @param {string} defaultImage - The default image to use if imagePath is not provided
 * @returns {string} - The formatted image URL
 */
export const formatImageUrl = (
  imagePath,
  defaultImage = "https://i.pinimg.com/1200x/b8/86/e5/b886e5b0b6521b970cc0f759a6ae55bb.jpg"
) => {
  // If no image path is provided, return the default image
  if (!imagePath) {
    return defaultImage;
  }

  // If the image path already includes http:// or https://, it's an absolute URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If the path starts with a slash, it's a relative path from the server root
  if (imagePath.startsWith("/")) {
    // Use the API base URL from the environment, or fall back to localhost
    const apiBaseUrl = "http://localhost:3000";
    return `${apiBaseUrl}${imagePath}`;
  }

  // For other cases, just return the original path
  return imagePath;
};
