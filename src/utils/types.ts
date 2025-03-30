/**
 * Represents an item that has been transfer via a DragEvent drop, read from the clipboard, uploaded
 * file or input string, containing a type and data.
 * The data can be either a string (like a URL) or a FileList object.
 */
export type TransferItem = {
  type: string
  data: string | FileList | Blob
}

/**
 * Represents a transfer item that has been stored in a Blob object.
 */
export type TransferBlob = {
  type: string
  data: Blob
}

/**
 * Represents a transfer item that can be accessed as a image source URL.
 */
export type TransferImage = {
  type: string
  data: string // URL
}

export const isImageMimeType = (type: string) => {
  return type.match(/^image\/(jpeg|jpg|gif|png|webp)$/) !== null
}

