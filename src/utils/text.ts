/**
 * This module extracts an image URL from various sources, including HTML.
 */

import { isImageUrl } from './url'
import { fetchImage } from './image';

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
 * @param {string} value - The HTML string to extract the image URL from
 * @returns {string|undefined} The first image URL found in the HTML string, or undefined if no image URL was found
 */
export const imagesFromStyle = (type: DOMParserSupportedType, value: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, type);
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
export const imagesFromImg = (type: DOMParserSupportedType, value: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, type);

  const images = doc.body.querySelectorAll('img');
  const attributes = Array.from(images).map(img => img.getAttribute('src')).filter(src => src !== null);
  console.log('attributes', attributes)

  return attributes;
}

const fromUrls = (type: string, values: string[]) => {
  return values.filter(isImageUrl)
}

export const fromHtml = (type: DOMParserSupportedType, value: string) => {
  return [...imagesFromImg(type, value), ...imagesFromStyle(type, value)];
}

export const fromPlain = (type: string, values: string) => {
  return fromUrls(type, [values]);
}

/*
  * This function extracts the URLs from text mime types.
  *
  * @param type - The MIME type of the data.
  * @param value - The text to convert.
  * @returns A Blob containing the image or undefined if it did not contain an image.
  */
export const fromText = (type: DOMParserSupportedType | 'text/plain', value: string): Promise<Blob | undefined> => {
  const urls = (type === 'text/html') ? fromHtml(type, value) : fromPlain(type, value)
  urls.forEach((url) => console.log('fromText', type, url));

  return urls.reduce((acc:  Promise<Blob | undefined>, url: string) =>
    acc.then((acc: Blob | undefined) => (acc !== undefined) ? acc : fetchImage(url).catch(() => undefined)),
    Promise.resolve(undefined))
}
