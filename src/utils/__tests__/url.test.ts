import { describe, it, expect } from 'vitest';
import { isImageName, isUrl, isImageUrl, isImageData } from '../url';

describe('isImageName', () => {
  it('should return true for valid image URLs', () => {
    expect(isImageName('https://example.com/image.jpg')).toBe(true);
    expect(isImageName('https://example.com/path/to/image.jpeg')).toBe(true);
    expect(isImageName('https://example.com/image.png')).toBe(true);
    expect(isImageName('https://example.com/image.gif')).toBe(true);
    expect(isImageName('https://example.com/image.webp')).toBe(true);
  });

  it('should return false for non-image URLs', () => {
    expect(isImageName('https://example.com/document.pdf')).toBe(false);
    expect(isImageName('https://example.com/file.txt')).toBe(false);
    expect(isImageName('https://example.com/page.html')).toBe(false);
    expect(isImageName('https://example.com/path/')).toBe(false);
  });

  it('should handle URLs with query parameters', () => {
    expect(isImageName('https://example.com/image.jpg?width=100&height=100')).toBe(true);
    expect(isImageName('https://example.com/file.txt?download=true')).toBe(false);
  });
});

describe('isUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isUrl('https://example.com')).toBe(true);
    expect(isUrl('http://example.com')).toBe(true);
    expect(isUrl('https://example.com/path/to/resource')).toBe(true);
    expect(isUrl('https://subdomain.example.com')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isUrl('example.com')).toBe(false);
    expect(isUrl('ftp://example.com')).toBe(false);
    expect(isUrl('https://')).toBe(false);
    expect(isUrl('This is not a URL')).toBe(false);
    expect(isUrl('')).toBe(false);
  });

  it('should handle URLs with query parameters and fragments', () => {
    expect(isUrl('https://example.com?param=value')).toBe(true);
    expect(isUrl('https://example.com/path?param=value&another=true')).toBe(true);
    expect(isUrl('https://example.com/path#section')).toBe(true);
  });
});

describe('isImageUrl', () => {
  it('should return true for valid image URLs', () => {
    expect(isImageUrl('https://example.com/image.jpg')).toBe(true);
    expect(isImageUrl('https://example.com/path/to/image.png')).toBe(true);
    expect(isImageUrl('http://subdomain.example.com/image.webp')).toBe(true);
  });

  it('should return false for non-image URLs', () => {
    expect(isImageUrl('https://example.com/document.pdf')).toBe(false);
    expect(isImageUrl('https://example.com/')).toBe(false);
    expect(isImageUrl('https://example.com/path')).toBe(false);
  });

  it('should return false for invalid URLs', () => {
    expect(isImageUrl('example.com/image.jpg')).toBe(false);
    expect(isImageUrl('image.png')).toBe(false);
    expect(isImageUrl('/path/to/image.gif')).toBe(false);
  });
});

describe('isImageData', () => {
  it('should return true for valid image data URLs', () => {
    expect(isImageData('data:image/jpeg;base64,/9j/4AAQSkZJRg==')).toBe(true);
    expect(isImageData('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA')).toBe(true);
    expect(isImageData('data:image/gif;base64,R0lGODlhAQABAIAAAP')).toBe(true);
    expect(isImageData('data:image/webp;base64,UklGRiQAAABXRUJQVlA4I')).toBe(true);
    expect(isImageData('data:image/jpg;base64,/9j/4AAQSkZJRg==')).toBe(true);
  });

  it('should return false for non-image data URLs', () => {
    expect(isImageData('data:text/plain;base64,SGVsbG8gV29ybGQ=')).toBe(false);
    expect(isImageData('data:application/pdf;base64,JVBERi0xLjQK')).toBe(false);
    expect(isImageData('data:audio/mp3;base64,SUQzBAAAAAAAI1')).toBe(false);
  });

  it('should return false for invalid data URLs', () => {
    expect(isImageData('https://example.com/image.jpg')).toBe(false);
    expect(isImageData('image/jpeg;base64,/9j/4AAQSkZJRg==')).toBe(false);
    expect(isImageData('data:image/jpg')).toBe(false);
    expect(isImageData('')).toBe(false);
  });
});
