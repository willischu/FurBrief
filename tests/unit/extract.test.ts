import { describe, it, expect, vi, beforeEach } from 'vitest';
import { detectMimeType, extractContent } from '../../lib/extract';

// PDF magic bytes: %PDF-
const pdfBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x00, 0x00, 0x00]).buffer;
// JPEG magic bytes: FF D8
const jpegBuffer = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00]).buffer;
// PNG magic bytes: 89 50 4E 47
const pngBuffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).buffer;
// Unknown bytes
const unknownBuffer = new Uint8Array([0x00, 0x01, 0x02, 0x03]).buffer;

describe('detectMimeType', () => {
  it('detects PDF from magic bytes', () => {
    expect(detectMimeType(pdfBuffer)).toBe('application/pdf');
  });

  it('detects JPEG from magic bytes', () => {
    expect(detectMimeType(jpegBuffer)).toBe('image/jpeg');
  });

  it('detects PNG from magic bytes', () => {
    expect(detectMimeType(pngBuffer)).toBe('image/png');
  });

  it('returns default fallback for unknown type', () => {
    expect(detectMimeType(unknownBuffer)).toBe('application/octet-stream');
  });

  it('returns custom fallback for unknown type', () => {
    expect(detectMimeType(unknownBuffer, 'image/heic')).toBe('image/heic');
  });
});

describe('extractContent', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('extracts text from PDF via pdf-parse', async () => {
    vi.doMock('pdf-parse', () => ({
      default: vi.fn().mockResolvedValue({ text: 'discharge instructions for luna' }),
    }));
    const result = await extractContent(pdfBuffer, 'application/pdf');
    expect(result.type).toBe('text');
    if (result.type === 'text') {
      expect(result.text).toBe('discharge instructions for luna');
    }
  });

  it('returns empty string if pdf-parse returns no text', async () => {
    vi.doMock('pdf-parse', () => ({
      default: vi.fn().mockResolvedValue({ text: '' }),
    }));
    const result = await extractContent(pdfBuffer, 'application/pdf');
    expect(result.type).toBe('text');
    if (result.type === 'text') {
      expect(result.text).toBe('');
    }
  });

  it('converts JPEG to base64 image content', async () => {
    const result = await extractContent(jpegBuffer, 'image/jpeg');
    expect(result.type).toBe('image');
    if (result.type === 'image') {
      expect(result.source.type).toBe('base64');
      expect(result.source.media_type).toBe('image/jpeg');
      expect(typeof result.source.data).toBe('string');
      expect(result.source.data.length).toBeGreaterThan(0);
    }
  });

  it('converts PNG to base64 image content', async () => {
    const result = await extractContent(pngBuffer, 'image/png');
    expect(result.type).toBe('image');
    if (result.type === 'image') {
      expect(result.source.media_type).toBe('image/png');
    }
  });

  it('base64 output round-trips correctly', async () => {
    const original = new Uint8Array([1, 2, 3, 4, 5]);
    const result = await extractContent(original.buffer, 'image/png');
    if (result.type === 'image') {
      const decoded = Buffer.from(result.source.data, 'base64');
      expect(Array.from(decoded)).toEqual(Array.from(original));
    }
  });
});
