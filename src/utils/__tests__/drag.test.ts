import { describe, it, expect, beforeAll, vi, afterAll } from 'vitest';
import { fromDrop } from '../drag';

const tests = [
  {
    name: "HTML is image source attribute",
    items: {
      "text/html": '<meta charset="utf-8"><img src="https://example.com/one.jpg" alt="View Papillon 88&quot; Oak Wood Dining Table by Laura Kim - image 1 of 13">',
      "text/uri-list": "https://example.com?something=else",
    },
    type: "image/jpeg",
    expected: true,
  },
  {
    name: "HTML is image style attribute",
    items: {
      "text/html": '<meta charset="utf-8"><div style="background-image: url(https://example.com/one.jpg)"></div>',
      "text/plain": "Papillon 88\" Oak Wood Dining Table by Laura Kim",
    },
    type: "image/png",
    expected: true,
  },
  {
    name: "HTML is image source attribute without an image suffix",
    items: {
      "text/html": '<meta charset="utf-8"><img src="https://example.com/testing" alt="View Papillon 88&quot; Oak Wood Dining Table by Laura Kim - image 1 of 13">',
      "text/uri-list": "https://example.com?something=else",
    },
    type: "image/png",
    expected: true,
  },
  {
    name: "image/png is used",
    items: {
      "text/html": '<meta charset="utf-8"><img src="https://example.com/two.jpg" alt="View Tate 60&quot; Walnut Wood Round Dining Table - image 1 of 12">',
    },
    type: "image/png",
    expected: true,
  },
  {
    name: "Data URL is used",
    items: {
      "text/plain": 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    },
    type: "image/gif",
    expected: true,
  },
  {
    name: "URL has query params",
    items: {
      "text/plain": 'https://example.com/four.jpg?width=628&quality=75&crop=3:2&auto=webp',
    },
    type: "image/jpeg",
    expected: true,
  },
  {
    name: "text/plain does not contain an image",
    items: {
      "text/plain": 'this is just text',
    },
    type: undefined,
    expected: false,
  },
  {
    name: "file test - with image",
    items: {
      "Files": [
        new File(['file content'], 'test.txt', { type: 'text/plain' }),
        new File([new Uint8Array([
          137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 8, 0, 0,
          0, 8, 8, 2, 0, 0, 0, 75, 109, 41, 220, 0, 0, 0, 34, 73, 68, 65, 84, 8, 215, 99, 120,
          173, 168, 135, 21, 49, 0, 241, 255, 15, 90, 104, 8, 33, 129, 83, 7, 97, 163, 136,
          214, 129, 93, 2, 43, 2, 0, 181, 31, 90, 179, 225, 252, 176, 37, 0, 0, 0, 0, 73, 69,
          78, 68, 174, 66, 96, 130])], 'test.png', { type: 'image/png' }),
      ],
    },
    type: 'image/png',
    expected: true,
  },
  {
    name: "file test - without image",
    items: {
      "Files": [new File(['file content'], 'test.txt', { type: 'text/plain' })],
    },
    type: undefined,
    expected: false,
  },

]

describe.each(tests)('retrieve image from drag event - name: $name, type: $type, expected: $expected', ({ items, type, expected }) => {
  let dragEvent: DragEvent;

  beforeAll(() => {
    const fetchStub = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(['mocked fetch response'], { type }))
      }),
    );

    global.fetch = fetchStub;

    dragEvent = {
      dataTransfer: {
        types: Object.keys(items),
        files: items["Files"],
        getData: vi.fn().mockImplementation((format: string) => items[format as keyof typeof items] || ''),
      }
    } as unknown as DragEvent;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  })

  it('should match the expected result', async () => {
    const image = await fromDrop(dragEvent);
    expect(image !== undefined).toEqual(expected);
    expect(image?.type).toEqual(type);
  });
})

