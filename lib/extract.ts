import { Buffer } from 'buffer';

export type PapersContent = { type: 'text'; text: string } | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };

export function detectMimeType(buffer: ArrayBuffer, fallback = 'application/octet-stream'): string {
  const bytes = new Uint8Array(buffer.slice(0, 8));
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'application/pdf';
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    return 'image/jpeg';
  }
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }
  return fallback;
}

export async function extractContent(buffer: ArrayBuffer, mimeType: string): Promise<PapersContent> {
  if (mimeType === 'application/pdf') {
    const pdfParse = await import('pdf-parse');
    const data = await pdfParse.default(Buffer.from(buffer));
    return { type: 'text', text: data.text || '' };
  }

  const base64 = Buffer.from(buffer).toString('base64');
  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: mimeType,
      data: base64,
    },
  };
}
