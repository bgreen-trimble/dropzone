import type { SearchQuery } from "./types";

const stringifyBlob = (blob: Blob) => {
  const { type } = blob

  console.log("stringifyBlob", type, blob)

  switch (type) {
    case 'text/html':
    case 'text/plain':
    case 'text/uri-list':
      {
        const text = blob.text()
        return text.then((data) => ({ type, data }))
      }
    case 'image/jpeg':
    case 'image/png':
    case 'image/webp':
    case 'image/gif':
    case 'image/jpg':
      {
        const text = blob.text()
        return text.then((data) => ({ type, data }))
      }
    default:
      return Promise.resolve({ type, data: undefined })
  }
};

export const stringify = (query: SearchQuery) => {
  const values = Object.values(query)
  console.log("values", values)

  return Promise.all(values.map((value) => stringifyBlob(value)))
}

