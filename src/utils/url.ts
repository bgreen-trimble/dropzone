
export const isImageName = (name: string) => {
  const url = new URL(name)
  return url.pathname.match(/\.(jpeg|jpg|gif|png|webp)/) !== null
}

export const isUrl = (url: string) => {
  return url.match(/^(https?:\/\/[^\s]+)$/) !== null
}

/**
 * Checks if the provided string is both a valid URL and represents an image file.
 *
 * @param url - The string to check if it's an image URL
 * @returns True if the string is both a valid URL and an image file name, false otherwise
 * @see isUrl
 * @see isImageName
 */
export const isImageUrl = (url: string) => {
  return isUrl(url) && isImageName(url)
}

/**
 * "data:image/" is a data URL scheme used to embed small image files directly into HTML or other web documents, avoiding external requests.
 * The data URL consists of a prefix (data:image/) followed by the MIME type and encoding information, and then the actual image data encoded in base64.
 * This allows images to be included inline, making it easier to share or embed images without needing separate files.
 * The data URL format is as follows:
 *
 * data:[<mediatype>][;base64],<data>
 * - <mediatype>: The MIME type of the data (e.g., image/jpeg, image/png).
 * - ;base64: Indicates that the data is base64-encoded.
 * - <data>: The actual data, which can be in base64 format or plain text.
 *
 * The data URL can be used in various contexts, such as in HTML <img> tags, CSS background images, or JavaScript.
 * The browser decodes the data URL and displays the image as if it were a regular image file.
 *
 * @param {string} data - The data URL to check.
 * @returns {boolean} - True if the data URL is valid and represents an image, false otherwise.
 */
export const isImageData = (data: string) => {
  return data.match(/^data:image\/(jpeg|jpg|gif|png|webp);base64/) !== null
}
