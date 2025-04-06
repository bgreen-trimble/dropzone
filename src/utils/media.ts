
/**
 * Sorts an array of media types. "image/*" types will naturally sort to the top.
 *
 * @param types - The array of types to sort.
 * @returns
 */
export const sortTypes = (types: string[]) => types.sort((a, b) =>  a.localeCompare(b))

export const isImageMimeType = (type: string) => type.startsWith('image/')
export const isTextMimeType = (type: string) => type.startsWith('text/')
export const isImageData = (type: string) => type.startsWith('image/') || type.startsWith('data:image/')
