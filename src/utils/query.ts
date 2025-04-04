import type { SearchQuery } from "./types";

const fromBlob = async (blob: Blob) => {
  const { type } = blob

  switch (type) {
    case 'text/html':
    case 'text/plain':
    case 'text/uri-list':
      const text = await blob.text()
      return { type, data: text }
    default:
      return { type, data: undefined }
  }
};

export const stringify = (query: SearchQuery) => {
  const entries = Object.entries(query)

  return entries.reduce(async (accPromise, [, value]) => {
    const acc = await accPromise;

    if (value instanceof Blob) {
      const { type, data } = await fromBlob(value);
      if (data !== undefined) {
        acc.push({ type, data });
      }
    }

    return acc;
  }, Promise.resolve([] as { type: string, data: string }[]));
}
