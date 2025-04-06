
/**
 * The clipboard contains a list of items. Each contains a list of Blobs.
 * Extract the Blobs from all the items, flatten and return them as an array.
 *
 * @param clipboardItems ClipboardItem[]
 * @returns
 */

import { isTextMimeType } from "./media";
import { fromText } from "./text";

const fromClipboardItems = (clipboardItems: ClipboardItem[]) => {
  // Map each clipboard item to an array of blobs (one for each type)
  const blobArrays = Promise.all(
    Array.from(clipboardItems).map(async (clipboardItem) =>
      Promise.all(clipboardItem.types.map((type) => clipboardItem.getType(type)))));

  // Flatten the array of arrays into a single array of blobs
  return blobArrays.then((arrays) => arrays.flat())
}

export const fromClipboard = (): Promise<Blob | undefined> =>
  navigator.clipboard.read()
    .then((clipboardItems) => fromClipboardItems(clipboardItems))
    .then((blobs) => {
      blobs.forEach((blob) => console.log(blob));
      blobs.sort((a, b) => a.type.localeCompare(b.type));
      // get all the blobs that are images
      const images = blobs.filter((blob) => blob.type.startsWith('image/'));
      if (images.length > 0) {
        return images[0];
      } else {
        // get all the blobs that are text and then convert them to type/value pairs
        const promises = blobs.filter((blob) => isTextMimeType(blob.type))
          .map((text) => text.text().then((value: string) => ({ type: text.type, value })));

        // reduce all the pair to a single type/value pair
        return Promise.all(promises)
        .then((texts) => texts.reduce(async (acc: Promise<Blob | undefined>, pair: { type: string, value: string }) => {
          const { type, value } = pair;
          return acc.then((acc: Blob | undefined) => (acc !== undefined) ? acc : fromText(type as DOMParserSupportedType, value)).catch(() => undefined);
        }, Promise.resolve(undefined)))
      }
    })



