import { isImageMimeType, type TransferItem } from './types'

const getClipboardItemText = (blob: Blob) => {
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

/*
  * Converts the contents of the clipboard to a TransferItem array.
  *
  * @returns An array of TransferItem objects.
  */
/**
 * It's not possible to read data from the navigator.clipboard API in Safari
 * without invoking what is referred to as the platform-specific UI unless the
 * origin of the data that is already on the clipboard is the same as origin
 * of the read request.
 *
 * See: https://webkit.org/blog/10855/async-clipboard-api
 */
export const fromClipboard = (): Promise<TransferItem[]> => {
  return navigator.clipboard.read().then((clipboardItems) => {
    console.log('clipboard items', clipboardItems)

    const items = Array.from(clipboardItems).map((clipboardItem) => getClipboardItem(clipboardItem))
    return Promise.all(items).then((items) => {
      console.log('items', items)
      return items.flat() // Flatten the array of arrays. It the clipboard contains multiple items, each will be flattened into the result.
    })
  }).catch((error) => {
    console.error('Failed to read clipboard contents: ', error)
    throw error
  })
}
