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
 * A query can be comprised of multiple items, such as text and image.
 * An array of blobs is used to represent the data. When the search is executed,
 * the blobs will be sent to the server for processing.
 *
 * For example:
 * - the text "sofa"
 * - an image of a sofa
 * - an image of a sofa the the text "red".
 * @type {Query}
 */
export type Query = Array<Blob>
