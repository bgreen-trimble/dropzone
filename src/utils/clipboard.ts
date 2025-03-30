import { isImageMimeType, type TransferItem } from './types'

const getClipboardItemText = (blob: Blob) => {
  console.log('blob', blob)
  return blob.text().then((text) => {
    console.log(`${blob.type} - text`, text)
    return text
  });
}

const getClipboardItemType = (clipboardItem: ClipboardItem, type: string) => {
  return clipboardItem.getType(type).then((blob) => {
    console.log(`${type} - blob`, blob)

    return isImageMimeType(type) ? Promise.resolve({ type, data: blob } as TransferItem) : getClipboardItemText(blob).then((text) => ({ type, data: text } as TransferItem))
  });
}

const getClipboardItem = (clipboardItem: ClipboardItem) => {

  const types = Array.from(clipboardItem.types).map((type) => getClipboardItemType(clipboardItem, type));

  return Promise.all(types).then((items) => {
    console.log('items', items)
    return items
  })

}

/**
 * This function uses the Clipboard API to read data from the clipboard.
 * It returns a promise that resolves to an array of TransferItem objects.
 * Each TransferItem contains a type and the corresponding data.
 *
 * Clipboard data contains a list of items, each with an array of key/value pairs.
 * The key is the MIME type of the data, and the value is a Blob object. All of these
 * are read and then flattened into a single array of TransferItem objects.
 *
 * @see https://webkit.org/blog/10855/async-clipboard-api
 * @returns A promise that resolves to an array of TransferItem objects.
 * @throws Will throw an error if clipboard access fails or is denied.
 */
export const fromClipboard = (): Promise<TransferItem[]> => {
  return navigator.clipboard.read().then((clipboardItems) => {
    console.log('clipboard items', clipboardItems)

    const items = Array.from(clipboardItems).map((clipboardItem) => getClipboardItem(clipboardItem))
    console.log('items', items)
    return Promise.all(items).then((items) => {
      console.log('items', items)
      return items.flat() // Flatten the array of arrays. It the clipboard contains multiple items, each will be flattened into the result.
    })
  }).catch((error) => {
    console.error('Failed to read clipboard contents: ', error)
    throw error
  })
}
