import { type TransferItem } from './types'

/*
  * Converts a drag event to a TransferItem array.
  *
  * @param event - The drag event to convert.
  * @returns An array of TransferItem objects.
  */

export const fromDropEvent = (event: DragEvent): TransferItem[] => {
  const data = event.dataTransfer;
  console.log('data', data)

  const types = data.types;
  console.log('types', types)

  const transferItems = types.map((type) => ({ type, data: (type === 'Files') ? data.files : data.getData(type) }))

  console.log('transferItems', transferItems)
  return transferItems
}

