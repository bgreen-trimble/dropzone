import { beforeAll, vi } from 'vitest'
import { Blob } from 'buffer';
import { b64toBlob } from './blob';

const createClipboardItem = (data: Record<string, Blob>) => ({
  types: Object.keys(data),
  getType: async (type: string) => data[type]
})

const one: Record<string, Blob> = {
  "text/html": new Blob(['<meta charset="utf-8"><img src="https://m.media-amazon.com/images/I/41BMTHSSlDL._UX300_PJku-sticker-v8%2CTopRight%2C0%2C-50_.jpg" alt="Alamo on the Rhine (Iron Crucible)">',], { type: "text/html" }),
  "text/plain": new Blob(["Alamo on the Rhine (Iron Crucible)"], { type: "text/plain" }),
}

const two: Record<string, Blob> = {
  "text/html": new Blob(['<meta charset="utf-8"><img src="https://m.media-amazon.com/images/I/41BqDTjayAL.UX300_PJku-sticker-v7,TopRight,0,-50_AC_SF480,480_.jpg" alt="Brink of War: A Prosecution Force Thriller (The Prosecution Force Thrillers Book 1)">'], { type: "text/html" }),
  "image/png": b64toBlob("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"),
}

const three: Record<string, Blob> = {
  "text/plain": new Blob(['data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='], { type: "text/plain" }),
}

//const clipboardItems = [createClipboardItem(one), createClipboardItem(two), createClipboardItem(three)]
const clipboardItems = [createClipboardItem(one), createClipboardItem(two)]

beforeAll(() => {
  const read = async () => clipboardItems

  // Mock clipboard API
  const clipboard = {
    read: vi.fn().mockReturnValue(read()),
  };

  vi.stubGlobal('global', {
    Blob: Blob,
  });

  vi.stubGlobal('navigator', {
    clipboard: clipboard,
  });

})
