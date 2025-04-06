
/**
 * The clipboard contains a list of items. Each contains a list of Blobs.
 * Extract the Blobs from all the items, flatten and return them as an array.
 *
 * @param clipboardItems ClipboardItem[]
 * @returns
 */

const fromClipboardItems = (clipboardItems: ClipboardItem[]) => {
  // Map each clipboard item to an array of blobs (one for each type)
  const blobArrays = Promise.all(
    Array.from(clipboardItems).map(async (clipboardItem) =>
      Promise.all(clipboardItem.types.map((type) => clipboardItem.getType(type)))));

  // Flatten the array of arrays into a single array of blobs
  return blobArrays.then((arrays) => arrays.flat())
}

export const fromClipboard = (): Promise<Blob[]> =>
  navigator.clipboard.read()
    .then((clipboardItems) => fromClipboardItems(clipboardItems))
    .then((blobs) => {
      blobs.forEach((blob) => console.log(blob));
      // Filter out any blobs that are not images
      return blobs.filter((blob) => blob.type.startsWith('image/'));
    })
