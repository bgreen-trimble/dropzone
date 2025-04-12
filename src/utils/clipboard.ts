
/**
 * The clipboard contains a list of items. Each contains a list of Blobs.
 * Extract the Blobs from all the items, flatten and return them as an array.
 *
 * @param clipboardItems ClipboardItem[]
 * @returns
 */

import { isTextMimeType } from "./media";
import { fromText } from "./text";

// Log the clipboard items to the console
export const dumpClipboard = () => {
  navigator.clipboard.read()
    .then((clipboardItems) => {
      clipboardItems.forEach((clipboardItem) => {
        console.log('ClipboardItem:', clipboardItem);
        clipboardItem.types.forEach((type) => {
          clipboardItem.getType(type).then((blob) => {
            console.log('Blob:', blob);
            blob.text().then((text) => {
              console.log('Text:', text);
            }
            ).catch(() => {
            });
          }).catch(() => {
          });
        });
      });
    })
    .catch((error) => {
      console.error('Error reading clipboard:', error);
    });
}

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
      // Log the blobs to the console
      blobs.forEach((blob) => {
        blob.text().then((text) => {
          console.log(blob.type, text)
        }).catch(() => {
        });
      });
      blobs.sort((a, b) => a.type.localeCompare(b.type));
      // get all the blobs that are images
      const images = blobs.filter((blob) => blob.type.startsWith('image/'));
      if (images.length > 0) {
        return images[0];
      } else {
        // get all the blobs that are text and then convert them to type/value pairs
        const promises = blobs.filter((blob) => isTextMimeType(blob.type))
          .map((text) => text.text().then((value: string) => ({ type: text.type, value })));

        // Reduce all the pairs to an image.
        return Promise.all(promises)
          .then((texts) => texts.reduce(async (acc: Promise<Blob | undefined>, pair: { type: string, value: string }) => {
            const { type, value } = pair;
            return acc.then((acc: Blob | undefined) => (acc !== undefined) ? acc : fromText(type as DOMParserSupportedType, value)).catch(() => undefined);
          }, Promise.resolve(undefined)))
      }
    })



