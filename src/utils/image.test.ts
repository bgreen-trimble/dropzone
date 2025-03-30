import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { imagesFromImg } from './image';

describe('imagesFromImg', () => {
  let originalConsoleLog: typeof console.log;

  beforeEach(() => {
    originalConsoleLog = console.log;
    console.log = vi.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('should extract src attributes from img elements', () => {
    const html = `
      <div>
        <img src="https://example.com/image1.jpg" alt="Image 1">
        <img src="https://example.com/image2.png" alt="Image 2">
      </div>
    `;

    const result = imagesFromImg(html);

    expect(result).toEqual([
      'https://example.com/image1.jpg',
      'https://example.com/image2.png'
    ]);
  });

  it('should handle data URLs as src attributes', () => {
    const html = `
      <div>
        <img src="data:image/jpeg;base64,/9j/4AAQSkZJRg==" alt="Data URL image">
      </div>
    `;

    const result = imagesFromImg(html);

    expect(result).toEqual(['data:image/jpeg;base64,/9j/4AAQSkZJRg==']);
  });

  it('should return an empty array when no img elements are found', () => {
    const html = `
      <div>
        <p>No images here</p>
      </div>
    `;

    const result = imagesFromImg(html);

    expect(result).toEqual([]);
  });

  it('should handle img elements with no src attribute', () => {
    const html = `
      <div>
        <img alt="No src">
        <img src="https://example.com/image.jpg" alt="Has src">
      </div>
    `;

    const result = imagesFromImg(html);

    expect(result).toEqual(['https://example.com/image.jpg']);
  });

  it('should handle malformed HTML', () => {
    const html = `
      <div>
        <img src="https://example.com/image.jpg" alt="Image">
        <img src="https://example.com/broken.jpg"
      </div>
    `;

    const result = imagesFromImg(html);

    // The parser should still find the valid img element
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toBe('https://example.com/image.jpg');
  });
});
