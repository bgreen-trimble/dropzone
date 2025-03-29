import { isImageMimeType, type TransferBlob, type TransferImage, type TransferItem } from './types'

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

const isImageData = (data: string) => {
  return data.match(/^data:image\/(jpeg|jpg|gif|png|webp)/) !== null
}

const fetchImage = (url: string) => {
  console.log('getImageFromUrl', url)
  // Encode the URL to handle special characters properly
  const encodedUrl = encodeURI(url)
  return fetch(encodedUrl)
    .then((response) => {
      console.log('response', response)
      if (!response.ok) {
        console.error('response not ok', response)
        return Promise.reject()
      }
      return response.blob()
    })
    .catch((error) => {
      console.error('Error fetching image:', error.message)
      throw error
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

  // Also search for computed styles with background-image if direct style didn't work
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
    try {
      if (isUrl(url)) {
        const data = await fetchImage(url);
        return { type, data };
      } else if (isImageData(url)) {
        const data = await dataUrlToBlob(url);
        return { type, data };
      }
      return null;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean) as TransferBlob[];
}

const fromHtml = async (type: string, html: string) => {
  const urls = [...fromImg(html), ...fromStyle(html)].filter(Boolean)

  return await fromUrls(type, urls)
}

const fromPlain = async (type: string, data: string) => {
  return await fromUrls(type, [data])
}

const fromBlob = async (type: string, data: Blob) => {
  return [{ type, data }]
}

const fromFiles = async (type: string, data: File[]) => {
  const files = data.filter((file) => isImageMimeType(file.type))

  const promises = files.map((file) => URL.createObjectURL(file)).map(async (url) => {
    console.log('fromFiles', url)
    try {
      const data = await fetchImage(url);
      return { type, data };
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    } finally {
      URL.revokeObjectURL(url)
    }
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

  return Promise.all(blobs).then((blobs) => blobs.flat().map((blob) => ({
    type: blob.type,
    data: URL.createObjectURL(blob.data)
  } as TransferImage)));
}
