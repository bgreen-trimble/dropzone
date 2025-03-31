/**
 * This module extracts image data from various sources, including HTML strings, URLs, and files.
 * It provides functions to handle different types of image data, such as data URLs, base64-encoded images, and image files.
 * The extracted image data is returned as a Promise that resolves to an array of TransferImage objects.
 * Each TransferImage object contains a MIME type and a URL representing the image.
 *
 * Each TransferBlob object contains a MIME type and a Blob representing the image data.
 * The "fromTransfer" function is the main entry point that takes an array of TransferItem objects and returns a Promise that resolves to an array of TransferImage objects.
 * All of the "from" functions are async functions that return a Promise that resolves to an array of TransferBlob objects.
 * "fromTransfer" uses the "from", functions to extract image data from the corresponding types.
 */

import { isImageMimeType, type TransferImage, type TransferItem } from './types'

/**
 * Represents a image blob containing binary data with an associated MIME type or "Files".
 * Images discovered in the transfer data will be read into to a blob.
 *
 * @typedef {Object} TransferBlob
 * @property {string} type - The MIME type of the binary data (e.g., 'image/jpeg', 'application/pdf').
 * @property {Blob} data - The binary data blob.
 */
export type TransferBlob = {
  type: string
  data: Blob
}

const isImageName = (name: string) => {
  const url = new URL(name)
  return url.pathname.match(/\.(jpeg|jpg|gif|png|webp)/) !== null
}

const isUrl = (url: string) => {
  return url.match(/^(https?:\/\/[^\s]+)$/) !== null
}

const isImageUrl = (url: string) => {
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
const isImageData = (data: string) => {
  return data.match(/^data:image\/(jpeg|jpg|gif|png|webp)/) !== null
}

/**
 * Fetches an image from the given URL and returns it as a blob.
 *
 * @param {string} url - The URL of the image to fetch.
 * @returns {Promise<Blob>} A Promise that resolves to the image data as a Blob.
 * @throws {Error} Will throw an error if the fetch operation fails or returns a non-OK response.
 * @throws {TypeError} Will throw if the URL is malformed or uses an unsupported protocol.
 * @throws {DOMException} May throw a DOMException for CORS issues or other security-related errors.
 */
const fetchImage = (url: string): Promise<Blob> => {
  console.log('fetchImage', url)
  // Encode the URL to handle special characters properly
  const encodedUrl = encodeURI(url)
  return fetch(encodedUrl)
    .then((response) => {
      console.log('response', response)
      if (!response.ok) {
        console.error('response not ok', response)
        return Promise.reject(new Error(`Failed to fetch image: ${response.status} ${response.statusText}`))
      }
      return response.blob()
    })
    .catch((error: DOMException | TypeError) => {
      console.error('Error fetching image:', error.message)
      throw error
    })
}

/**
 * Extracts image URLs from HTML.
 *
 * Looks for elements with a style attribute containing background-image.
 * If found, it extracts the URL from the style attribute.
 * It also checks the computed styles of all elements.
 * If a background-image is found in the computed styles, it extracts the URL.
 *
 * TODO: deal with an svg at some point later.
 *
 * @param {string} html - The HTML string to extract the image URL from
 * @returns {string|undefined} The first image URL found in the HTML string, or undefined if no image URL was found
 */
export const imagesFromStyle = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const urls = []

  // Look for elements with style containing background-image
  const elementsWithStyle = doc.querySelectorAll('[style*="background-image"]');
  // Try to extract URL from background-image
  for (const element of elementsWithStyle) {
    const style = element.getAttribute('style');
    if (style) {
      const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
      if (match && match[1]) {
        urls.push(match[1]);
      }
    }
  }

  // Also search for computed styles with background-image
  const allElements = doc.querySelectorAll('*');
  for (const element of allElements) {
    const computedStyle = window.getComputedStyle(element);
    const backgroundImage = computedStyle.backgroundImage;
    if (backgroundImage && backgroundImage !== 'none') {
      const match = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/i);
      if (match && match[1]) {
        urls.push(match[1]);
      }
    }
  }

  return urls;
}

/**
 * Extracts image URLs from HTML.
 * It looks for <img> elements in the HTML and extracts the src attribute.
 *
 * @param {string} html - The HTML string to extract the image URL from
 * @returns {string|undefined} The first image URL found in the HTML string, or undefined if no image URL was found
 */
export const imagesFromImg = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const images = doc.body.querySelectorAll('img');
  const attributes = Array.from(images).map(img => img.getAttribute('src')).filter(src => src !== null);
  console.log('attributes', attributes)

  return attributes;
}

/**
 * Converts a data URL (e.g., data:image/jpeg;base64,...) to a Promise that resolves to a Blob.
 *
 * @param {string} dataUrl - The data URL to convert.
 * @returns {Promise<Blob>} - A Promise that resolves to the resulting Blob object.
 */
const dataUrlToBlob = (dataUrl: string): Promise<Blob> => {
  // Split the data URL into the metadata and the base64-encoded data
  const [metadata, base64Data] = dataUrl.split(',');

  // Extract the MIME type from the metadata
  const mimeType = metadata.match(/:(.*?);/)?.[1] || '';

  // Decode the base64 string into a byte array
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  // Create and return a Blob from the byte array
  return Promise.resolve(new Blob([byteArray], { type: mimeType }));
};

const fromUrls = async (type: string, urls: string[]) => {
  const promises = urls.map(async (url) => {
    const data = isImageUrl(url) ? await fetchImage(url) : isImageData(url) ? await dataUrlToBlob(url) : null;

    return data ? { type, data } : null;
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean) as TransferBlob[];
}

const fromHtml = async (type: string, html: string) => {
  const urls = [...imagesFromImg(html), ...imagesFromStyle(html)].filter(Boolean)

  return await fromUrls(type, urls)
}

const fromPlain = async (type: string, data: string) => {
  return await fromUrls(type, [data])
}

const fromBlob = async (type: string, data: Blob) => {
  return [{ type, data }]
}

/**
 * Converts a FileList to an array of TransferBlob objects.
 * A bit of a hack, but it works well enough for this application.
 * It uses URL.createObjectURL to create a URL for each file in the FileList.
 * The URL is then used to fetch the image data as a Blob.
 *
 * @param type
 * @param data
 * @returns
 */
const fromFiles = async (type: string, data: File[]) => {
  const files = data.filter((file) => isImageMimeType(file.type))

  const promises = files.map((file) => URL.createObjectURL(file)).map(async (url) => {
    console.log('fromFiles', url)
    const data = await fetchImage(url);
    URL.revokeObjectURL(url)

    return data ? { type, data } : null;
  })

  const results = await Promise.all(promises);
  return results.filter(Boolean) as TransferBlob[];
}

/*
  * Converts a TransferItem array to an image URL.
  *
  * Type of data:
  * - Blob: The blob containing the image.
  * - FileList: The first file in the list is converted to a URL using URL.createObjectURL.
  * - String: The string is checked if it is a URL or a base64 data URL. If it is a URL, it is returned as is. If it is a base64 data URL, it is returned as is.
  *
  * text/uri-list:
  * - The string is checked if it is a URL or a base64 data URL. If it is a URL, it is returned as is. If it is a base64 data URL, it is returned as is.
  * @param items - The TransferItem array to convert.
  * @returns An array of image URLs.
  */
export const fromTransfer = async (items: TransferItem[]) => {
  const blobs = items.map(async (item) => {
    const { type, data } = item
    console.log(type, data)

    switch (type) {
      case 'text/html':
        return await fromHtml(type, data as string)

      case 'text/plain':
        return await fromPlain(type, data as string)

      case 'text/uri-list':
        // chrome sends text/uri-list as a single line
        return await fromPlain(type, data as string)

      case 'image/gif':
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'image/webp':
        if (data instanceof Blob) {
          return await fromBlob(type, data as Blob)
        } else if (typeof data === 'string' && isImageUrl(data)) {
          return await fromPlain(type, data as string)
        }
        return []

      case 'Files':
      case 'files':
        console.log('Files', data)
        if (data instanceof FileList) {
          return await fromFiles(type, Array.from(data))
        }
        return []
      default:
        return []
    }
  });

  /*
    * The blobs array contains promises that resolve to arrays of TransferBlob objects.
    * Use Promise.all to wait for all the promises to resolve and then flatten the resulting array.
    * Finally, map over the flattened array to create an array of TransferImage objects.
    */
  return Promise.all(blobs).then((blobs) => blobs.flat().map((blob) => ({
    type: blob.type,
    data: URL.createObjectURL(blob.data)
  } as TransferImage)));
}
