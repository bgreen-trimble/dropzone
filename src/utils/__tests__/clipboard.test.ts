import { describe, it, expect } from 'vitest';
import { fromClipboard } from '../clipboard';

describe('Test clipboard', () => {
  it('should return items from the clipboard', async () => {
    const image = await fromClipboard();
    expect(navigator.clipboard.read).toHaveBeenCalled();
    expect(image).toEqual(undefined);
  });
})
