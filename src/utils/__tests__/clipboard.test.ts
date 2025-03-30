import { describe, it, expect } from 'vitest';
import { fromClipboard } from '../clipboard';

describe('Test clipboard', () => {
  it('should return items from the clipboard', async () => {
    const items = await fromClipboard();
    expect(navigator.clipboard.read).toHaveBeenCalled();
    expect(items.length).toEqual(4);
  });
})
