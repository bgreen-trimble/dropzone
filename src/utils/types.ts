/**
 * A normalized representation of data that has been transferred via Drag and Drop,
 * read from the clipboard, uploaded file(s) or an input string.
 *
 * @typedef {Object} TransferItem
 * @property {string} type - The type identifier for the transferred item. Usually a MIME type or "Files" for file lists.
 * @property {string | FileList | Blob} data - The actual data being transferred, which can be a string, a FileList, or a Blob
 */
export type TransferItem = {
  type: string
  data: string | FileList | Blob
}

/**
 * Represents an image in a transfer format, containing a MIME type or "Files" and a URL.
 * The URL can be a base64 data URL or a regular URL including one created using URL:createObjectURL().
 *
 * @typedef {Object} TransferImage
 * @property {string} type - The MIME type of the image (e.g., 'image/jpeg').
 * @property {string} data - The URL of the image, which can be a base64 data URL or a regular URL.
 */
export type TransferImage = {
  type: string
  data: string // URL
}

/**
 * Represents a search query that is an array of Blob of which some Blobs may be a File.
 *
 * There are various ways to create a search query:
 * - Drag and drop
 * - Copy and paste
 * - Uploading a file
 * - Inputting a string
 *
 * Each way can result in one or more types. Some types can be a string and others a Blob
 * For example, a search query can contain a string and an image.
 * The string can be a URL or a base64 data URL.
 * The image can be a base64 data URL or a regular URL including one created using URL:createObjectURL().
 * The image can also be a File object.
 *
 *
 */
export type SearchQuery = Array<Blob>
