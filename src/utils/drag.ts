import { fetchImage } from './image';
import { isTextMimeType, sortTypes } from './media';
import { fromHtml, fromPlain, fromText } from './text';

/*
  * This function extracts the data from the DragEvent's dataTransfer object,
  * converting it into an array of TransferItem objects.
  * The type is usually a MIME type or "Files" for file lists.
  * The data can be a string, a FileList, or a Blob.
  *
  * @param event - The drag event to convert.
  * @returns A Blob containing the image or undefined if the drop did not contain an image.
  */
export const fromDrop = async (event: DragEvent): Promise<Blob | File | undefined> => {
  const { dataTransfer } = event;
  const { types } = dataTransfer ?? { types: [] };;
  const sorted = sortTypes(Array.from(types));
  console.log('sorted', sorted)

  sorted.forEach((type) => console.log(type, dataTransfer?.getData(type)));

  for (let i = 0; i < sorted.length; i++) {
    const type = sorted[i];

    if (type === 'Files') {
        const files = dataTransfer?.files;
        if (files && files.length > 0) {
          return Promise.resolve(files[0]);
        }
      }
      else if (isTextMimeType(type)) {
        const data = dataTransfer?.getData(type);
        if (data) {
          return fromText(type as DOMParserSupportedType, data);
        }
    }
  }

  return Promise.resolve(undefined)
}


