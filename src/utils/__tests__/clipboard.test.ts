import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { Blob } from 'buffer';
import { b64toBlob } from './blob';
import { fromClipboard } from '../clipboard';

const createClipboardItem = (data: Record<string, Blob>) => ({
  types: Object.keys(data),
  getType: async (type: string) => data[type]
})

const createClipboardItems = (data: Record<string, Blob>) => [createClipboardItem(data)]

const tests = [
  {
    name: "HTML is image source attribute",
    items:
      createClipboardItems({
        "text/html": new Blob(['<meta charset="utf-8"><img src="https://example.com/one.jpg" alt="View Papillon 88&quot; Oak Wood Dining Table by Laura Kim - image 1 of 13">'], { type: "text/html" }),
        "text/plain": new Blob(["Papillon 88\" Oak Wood Dining Table by Laura Kim"], { type: "text/plain" }),
      }),
    type: "image/jpeg",
    expected: true,
  },
  {
    name: "HTML is image style attribute",
    items:
      createClipboardItems({
        "text/html": new Blob(['<meta charset="utf-8"><div style="background-image: url(https://example.com/one.jpg)"></div>'], { type: "text/html" }),
        "text/plain": new Blob(["Papillon 88\" Oak Wood Dining Table by Laura Kim"], { type: "text/plain" }),
      }),
    type: "image/png",
    expected: true,
  },
  {
    name: "image/png is used",
    items:
      createClipboardItems({
        "text/html": new Blob(['<meta charset="utf-8"><img src="https://example.com/two.jpg" alt="View Tate 60&quot; Walnut Wood Round Dining Table - image 1 of 12">'], { type: "text/html" }),
        "image/png": b64toBlob("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII", 'image/png'),
      }),
    type: "image/png",
    expected: true,
  },
  {
    name: "Data URL is used",
    items:
      createClipboardItems({
        "text/plain": new Blob(['data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='], { type: "text/plain" }),
      }),
    type: "image/gif",
    expected: true,
  },
  {
    name: "URL has query params",
    items:
      createClipboardItems({
        "text/plain": new Blob(['https://example.com/four.jpg?width=628&quality=75&crop=3:2&auto=webp'], { type: "text/plain" }),
      }),
    type: "image/jpeg",
    expected: true,
  },
  {
    name: "text/plain does not contain an image",
    items:
      createClipboardItems({
        "text/plain": new Blob(['this is just text'], { type: "text/plain" }),
      }),
    type: undefined,
    expected: false,
  },
]

describe.each(tests)('retrieve image from clipboard - name: $name, type: $type, expected: $expected', ({ items, type, expected }) => {
  beforeAll(() => {
    const fetchStub = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(['mocked fetch response'], { type }))
      }),
    );

    global.fetch = fetchStub;

    // Mock clipboard API
    const clipboard = {
      read: vi.fn().mockReturnValue(Promise.resolve(items)),
    };

    vi.stubGlobal('navigator', {
      clipboard: clipboard,
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  })

  it('should match the expected result', async () => {
    const image = await fromClipboard();
    console.log('image', image?.type);
    expect(navigator.clipboard.read).toHaveBeenCalled();
    expect(image !== undefined).toEqual(expected);
    expect(image?.type).toEqual(type);
  });

})
