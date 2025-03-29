import { isImageMimeType, type TransferItem } from './types'

const isImageName = (name: string) => {
  return name.match(/\.(jpeg|jpg|gif|png)$/)
}

const isUrl = (url: string) => {
  return url.match(/^(https?:\/\/[^\s]+)$/)
}

const isImageUrl = (url: string) => {
  return isUrl(url) && isImageName(url)
}

const isImageData = (data: string) => {
  return data.match(/^data:image\/(jpeg|jpg|gif|png)/)
}

const getImageFromUrl = (url: string) => {
  console.log('getImageFromUrl', url)
  // Encode the URL to handle special characters properly
  const encodedUrl = encodeURI(url)
  return fetch(encodedUrl)
    .then((response) => {
      console.log('response', response)
      if (!response.ok) {
        return undefined
      }
      return response.blob()
    })
    .catch((error) => {
      console.error('Error fetching image:', error)
      return undefined
    })
}

/**
 * Extracts the first image URL from an HTML string.
 *
 * Can assume based on the attribute that it is an image.
 * TODO: deal with an svg at some point later.
 *
 * @param {string} html - The HTML string to extract the image URL from
 * @returns {string|undefined} The first image URL found in the HTML string, or undefined if no image URL was found
 */
const fromStyle = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Look for elements with style containing background-image
  const elementsWithStyle = doc.querySelectorAll('[style*="background-image"]');
  // Try to extract URL from background-image
  for (const element of elementsWithStyle) {
    const style = element.getAttribute('style');
    if (style) {
      const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
      if (match && match[1]) {
        const url = match[1];
        return url;
      }
    }
  }

  // Also search for computed styles with background-image if direct style didn't work
  const allElements = doc.querySelectorAll('*');
  for (const element of allElements) {
    const computedStyle = window.getComputedStyle(element);
    const backgroundImage = computedStyle.backgroundImage;
    if (backgroundImage && backgroundImage !== 'none') {
      const match = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/i);
      if (match && match[1]) {
        const url = match[1];
        return url;
      }
    }
  }

  return undefined;
}

/**
 * Extracts the first image URL from an HTML string.
 *
 * @param {string} html - The HTML string to extract the image URL from
 * @returns {string|undefined} The first image URL found in the HTML string, or undefined if no image URL was found
 */
const fromImg = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const images = doc.body.querySelectorAll('img');
  const attributes = Array.from(images).map(img => img.getAttribute('src')).filter(src => src !== null);
  console.log('attributes', attributes)

  return attributes ? attributes[0] : undefined;
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

/*
  * Converts a TransferItem array to an image URL.
  *
  * Type of data:
  * - Blob: The blob is converted to a URL using URL.createObjectURL.
  * - FileList: The first file in the list is converted to a URL using URL.createObjectURL.
  * - String: The string is checked if it is a URL or a base64 data URL. If it is a URL, it is returned as is. If it is a base64 data URL, it is returned as is.
  *
  * text/uri-list:
  * - The string is checked if it is a URL or a base64 data URL. If it is a URL, it is returned as is. If it is a base64 data URL, it is returned as is.
  * @param items - The TransferItem array to convert.
  * @returns An array of image URLs.
  */
export const getImages = (items: TransferItem[]) => {
  const images = items.map((item) => {
    const { type, data } = item

    switch (type) {
      case 'text/uri-list':
      case 'text/plain':
        const value = data as string
        if (isImageUrl(value)) {
          return getImageFromUrl(value)
        } else if (isImageData(value)) {
          return dataUrlToBlob(value)
        }
        return undefined
      case 'text/html':
        console.log('text/html', data)
        const url = fromImg(data as string) ?? fromStyle(data as string)
        console.log('url', url)
        if (url) {
          if (isUrl(url)) {
            return getImageFromUrl(url)
          } else if (isImageData(url)) {
            return dataUrlToBlob(url)
          }
        }
        return undefined
      case 'Files':
      case 'files':
        if (data instanceof FileList) {
          const files = Array.from(data)
          const imageFiles = files.filter((file) => isImageMimeType(file.type))
          if (imageFiles.length > 0) {
            return getImageFromUrl(URL.createObjectURL(imageFiles[0]))
          }
        }
        return undefined
      case 'submit':
        return getImageFromUrl(data as string)

      default:
        if (isImageMimeType(type)) {
          if (data instanceof Blob) {
            return Promise.resolve(data)
          } else if (typeof data === 'string') {
            if (isImageUrl(data)) {
              return getImageFromUrl(data)
            }
          }
        }
        return undefined
    }
  })
  return Promise.all(images).then((blobs) => blobs.filter((blob) => blob !== undefined))
}
