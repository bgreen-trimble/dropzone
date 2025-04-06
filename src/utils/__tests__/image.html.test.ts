import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { imagesFromImg, imagesFromStyle } from '../text';

describe('Parsing HTML for images', () => {
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

    const result = imagesFromImg('text/html', html);

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

    const result = imagesFromImg('text/html', html);

    expect(result).toEqual(['data:image/jpeg;base64,/9j/4AAQSkZJRg==']);
  });

  it('should return an empty array when no img elements are found', () => {
    const html = `
      <div>
        <p>No images here</p>
      </div>
    `;

    const result = imagesFromImg('text/html', html);

    expect(result).toEqual([]);
  });

  it('should handle img elements with no src attribute', () => {
    const html = `
      <div>
        <img alt="No src">
        <img src="https://example.com/image.jpg" alt="Has src">
      </div>
    `;

    const result = imagesFromImg('text/html', html);

    expect(result).toEqual(['https://example.com/image.jpg']);
  });

  it('should handle malformed HTML', () => {
    const html = `
      <div>
        <img src="https://example.com/image.jpg" alt="Image">
        <img src="https://example.com/broken.jpg"
      </div>
    `;

    const result = imagesFromImg('text/html', html);

    // The parser should still find the valid img element
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toBe('https://example.com/image.jpg');
  });
});

describe('Parsing HTML for background images', () => {
  let originalConsoleLog: typeof console.log;
  let originalGetComputedStyle: typeof window.getComputedStyle;

  beforeEach(() => {
    originalConsoleLog = console.log;
    console.log = vi.fn();
    originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn().mockImplementation(() => ({
      backgroundImage: 'none'
    }));
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    window.getComputedStyle = originalGetComputedStyle;
  });

  it('should extract URLs from inline style with background-image', () => {
    const html = `
      <div style="background-image: url('https://example.com/bg1.jpg')">
        <span style="background-image: url('https://example.com/bg2.png')"></span>
      </div>
    `;

    const result = imagesFromStyle('text/html', html);

    expect(result).toEqual([
      'https://example.com/bg1.jpg',
      'https://example.com/bg2.png'
    ]);
  });

  it('should handle background-image URLs with different quote styles', () => {
    const html = `
      <div style="background-image: url(https://example.com/no-quotes.jpg)">
        <span style="background-image: url('https://example.com/single-quotes.png')"></span>
      </div>
    `;

    const result = imagesFromStyle('text/html', html);

    expect(result).toEqual([
      'https://example.com/no-quotes.jpg',
      'https://example.com/single-quotes.png',
    ]);
  });

  it('should extract URLs from computed styles with background-image', () => {
    const html = `<div id="test">Element with computed style</div>`;

    // Mock getComputedStyle to return background-image for specific elements
    window.getComputedStyle = vi.fn().mockImplementation((element) => {
      if (element.id === 'test') {
        return {
          backgroundImage: 'url("https://example.com/computed-bg.jpg")'
        };
      }
      return {
        backgroundImage: 'none'
      };
    });

    const result = imagesFromStyle('text/html', html);

    expect(result).toEqual(['https://example.com/computed-bg.jpg']);
  });

  it('should return an empty array when no background images are found', () => {
    const html = `
      <div>
        <p>No background images here</p>
      </div>
    `;

    const result = imagesFromStyle('text/html', html);

    expect(result).toEqual([]);
  });

  it('should handle multiple background images from both inline and computed styles', () => {
    const html = `
      <div style="background-image: url('https://example.com/inline-bg.jpg')">
        <span id="computed">Element with computed style</span>
      </div>
    `;

    window.getComputedStyle = vi.fn().mockImplementation((element) => {
      if (element.id === 'computed') {
        return {
          backgroundImage: 'url("https://example.com/computed-bg.jpg")'
        };
      }
      return {
        backgroundImage: 'none'
      };
    });

    const result = imagesFromStyle('text/html', html);

    expect(result).toContain('https://example.com/inline-bg.jpg');
    expect(result).toContain('https://example.com/computed-bg.jpg');
    expect(result.length).toBe(2);
  });
});
