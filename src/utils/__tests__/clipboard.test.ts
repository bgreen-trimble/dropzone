import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { fromClipboard } from '../clipboard';
import { Blob } from 'buffer';

const data: Record<string, string> = {
  "text/html": '<meta charset="utf-8"><img src="https://m.media-amazon.com/images/I/41BMTHSSlDL._UX300_PJku-sticker-v8%2CTopRight%2C0%2C-50_.jpg" alt="Alamo on the Rhine (Iron Crucible)">',
  "text/plain": "Alamo on the Rhine (Iron Crucible)"
}

describe('Test clipboard', () => {
  beforeEach(() => {
    const clipboardItem = {
      types: Object.keys(data),
      getType: async (type: string) => new Blob([data[type]], { type })
    };

    const read = async () => {
      return [clipboardItem, clipboardItem];
    };

    // Mock clipboard API
    const clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue('mocked clipboard text'),
      write: vi.fn().mockResolvedValue(() => Promise.resolve()),
      read: vi.fn().mockReturnValue(read()),
    };

    vi.stubGlobal('global', {
      Blob: Blob,
    });

    vi.stubGlobal('navigator', {
      clipboard: clipboard,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should show the clipboard mock is operating correctly', async () => {
    const items = await navigator.clipboard.read();

    const types = items[0].types
    expect(types).toEqual(Object.keys(data));

    const blob = await items[0].getType(types[0])
    const type = blob.type
    expect(type).toEqual(types[0]);

    const text = await blob.text()
    expect(text).toEqual(data[type]);
  });

  it('should return items from the clipboard', async () => {
    const items = await fromClipboard();
    console.log('items', items, items.length);
    expect(navigator.clipboard.read).toHaveBeenCalled();
    expect(items.length).toEqual(Object.keys(data).length * 2);
  });
})
