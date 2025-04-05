import { type TransferItem } from './types'

/*
  * This function extracts the data from the DragEvent's dataTransfer object,
  * converting it into an array of TransferItem objects.
  * Each TransferItem contains a type and the corresponding data.
  * The type is usually a MIME type or "Files" for file lists.
  * The data can be a string, a FileList, or a Blob.
  *
  * @param event - The drag event to convert.
  * @returns An array of TransferItem objects.
  */
export const fromDropEvent = (event: DragEvent): TransferItem[] => {
  const data = event.dataTransfer;
  console.log('data', data)

  const types = data?.types;
  console.log('types', types)

  const transferItems = (data !== null && types !== undefined) ? types.map((type) => ({ type, data: (type === 'Files') ? data.files : data.getData(type) })) : []

  console.log('transferItems', transferItems)
  return transferItems
}

export const fromDropEventX = (event: DragEvent): Blob[] => {
  const query: Blob[] = [];

  const { dataTransfer } = event;
  console.log('dataTransfer', dataTransfer)

  if (dataTransfer) {
    const { types } = dataTransfer;
    console.log('types', types)

    if (types) {
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        console.log('type', type)
        if (type === 'Files') {
          Array.from(dataTransfer.files).forEach((file) => query.push(file));
        } else {
          const data = dataTransfer.getData(type);
          console.log('data', data)
          query.push(new Blob([data], { type }));
        }
      }
    }
  }

  console.log('fromDropEventX', query)
  return query
}

