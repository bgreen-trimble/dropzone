import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fromTransfer } from '../image';
import { isImageUrl, isImageData } from '../helpers';
import { type TransferItem } from '../types';

// Mock the fetch function
vi.mock('window', () => ({
  fetch: vi.fn(),
}));

// Mock the helpers
vi.mock('../helpers', () => ({
  isImageUrl: vi.fn(),
  isImageData: vi.fn(),
}));

describe('fromTransfer', () => {
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    // Save original functions
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    originalFetch = global.fetch;

    // Mock URL.createObjectURL
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    URL.revokeObjectURL = vi.fn();

    // Mock fetch to return a successful response with a mock blob
    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob(['mock image data'], { type: 'image/jpeg' })),
        } as unknown as Response),
    );

    // Mock helper functions
    (isImageUrl as any).mockImplementation((url: string) => url.startsWith('http'));
    (isImageData as any).mockImplementation((url: string) => url.startsWith('data:image'));
  });

  afterEach(() => {
    // Restore original functions
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    window.fetch = originalFetch;

    vi.clearAllMocks();
  });

  it('should handle text/html items and extract images', async () => {
    // Mock the DOMParser
    const mockQuerySelectorAll = vi.fn().mockReturnValue([
      { getAttribute: () => 'src="https://example.com/image.jpg"' }
    ]);

    global.DOMParser = vi.fn().mockImplementation(() => ({
      parseFromString: vi.fn().mockReturnValue({
        body: {
          querySelectorAll: mockQuerySelectorAll
        },
        querySelectorAll: mockQuerySelectorAll
      })
    }));

    const items: TransferItem[] = [
      { type: 'text/html', data: '<img src="https://example.com/image.jpg">' }
    ];

    const result = await fromTransfer(items);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('text/html');
    expect(result[0].data).toBe('blob:mock-url');
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('should handle text/plain items with image URLs', async () => {
    const items: TransferItem[] = [
      { type: 'text/plain', data: 'https://example.com/image.jpg' }
    ];

    const result = await fromTransfer(items);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('text/plain');
    expect(result[0].data).toBe('blob:mock-url');
  });

  it('should handle text/uri-list items', async () => {
    const items: TransferItem[] = [
      { type: 'text/uri-list', data: 'https://example.com/image.jpg' }
    ];

    const result = await fromTransfer(items);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('text/uri-list');
    expect(result[0].data).toBe('blob:mock-url');
  });

  it('should handle image types with Blob data', async () => {
    const mockBlob = new Blob(['mock image data'], { type: 'image/jpeg' });
    const items: TransferItem[] = [
      { type: 'image/jpeg', data: mockBlob }
    ];

    const result = await fromTransfer(items);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('image/jpeg');
    expect(result[0].data).toBe('blob:mock-url');
  });

  it('should handle image types with URL string data', async () => {
    const items: TransferItem[] = [
      { type: 'image/jpeg', data: 'https://example.com/image.jpg' }
    ];

    const result = await fromTransfer(items);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('image/jpeg');
    expect(result[0].data).toBe('blob:mock-url');
  });

  it('should handle Files type with FileList data', async () => {
    const mockFile = new File(['mock image data'], 'image.jpg', { type: 'image/jpeg' });
    const mockFileList: FileList = [mockFile].values() as unknown as FileList;

    const items: TransferItem[] = [
      { type: 'Files', data: mockFileList }
    ];

    const result = await fromTransfer(items);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('Files');
    expect(result[0].data).toBe('blob:mock-url');
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should handle data URLs in text items', async () => {
    const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
    const items: TransferItem[] = [
      { type: 'text/plain', data: dataUrl }
    ];

    (isImageUrl as any).mockReturnValue(false);
    (isImageData as any).mockReturnValue(true);

    global.atob = vi.fn().mockReturnValue('mock decoded data');

    const result = await fromTransfer(items);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('text/plain');
    expect(result[0].data).toBe('blob:mock-url');
  });

  it('should ignore unsupported item types', async () => {
    const items: TransferItem[] = [
      { type: 'application/pdf', data: 'some pdf data' }
    ];

    const result = await fromTransfer(items);

    expect(result).toHaveLength(0);
  });

  it('should process multiple items of different types', async () => {
    const mockBlob = new Blob(['mock image data'], { type: 'image/jpeg' });
    const mockFile = new File(['mock image data'], 'image.jpg', { type: 'image/jpeg' });
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: (i: number) => mockFile,
      [Symbol.iterator]: function* () { yield mockFile; }
    } as FileList;

    const items: TransferItem[] = [
      { type: 'text/plain', data: 'https://example.com/image.jpg' },
      { type: 'image/jpeg', data: mockBlob },
      { type: 'Files', data: mockFileList },
      { type: 'application/pdf', data: 'ignored' }
    ];

    const result = await fromTransfer(items);

    expect(result).toHaveLength(3);
  });
});
