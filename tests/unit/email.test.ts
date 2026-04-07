import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSubject, sendBriefEmail } from '../../lib/email';

describe('getSubject', () => {
  it('returns English subject', () => {
    expect(getSubject('en', 'Luna')).toBe('Your furbrief for Luna is ready');
  });

  it('returns Spanish subject', () => {
    expect(getSubject('es', 'Luna')).toBe('El furbrief de Luna está listo');
  });

  it('returns Korean subject', () => {
    expect(getSubject('ko', 'Luna')).toBe('Luna의 퍼브리프가 준비되었습니다');
  });

  it('returns Chinese subject', () => {
    expect(getSubject('zh', 'Luna')).toBe('Luna的毛简报已准备好');
  });

  it('includes the pet name correctly', () => {
    expect(getSubject('en', 'Mr. Whiskers')).toContain('Mr. Whiskers');
  });
});

describe('sendBriefEmail', () => {
  const env = process.env;

  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_FROM_EMAIL = 'test@example.com';
    process.env.NEXT_PUBLIC_APP_URL = 'https://furbrief.com';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    process.env = env;
    vi.unstubAllGlobals();
  });

  it('calls Resend API with correct URL', async () => {
    await sendBriefEmail('owner@example.com', 'Luna', 'en', 'abc123');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('sends correct recipient and subject', async () => {
    await sendBriefEmail('owner@example.com', 'Luna', 'en', 'abc123');
    const body = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(body.to).toBe('owner@example.com');
    expect(body.subject).toBe('Your furbrief for Luna is ready');
  });

  it('includes brief URL in email body', async () => {
    await sendBriefEmail('owner@example.com', 'Luna', 'en', 'mytoken');
    const body = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(body.text).toContain('https://furbrief.com/brief/mytoken');
  });

  it('uses correct Authorization header', async () => {
    await sendBriefEmail('owner@example.com', 'Luna', 'en', 'abc123');
    const headers = (fetch as any).mock.calls[0][1].headers;
    expect(headers['Authorization']).toBe('Bearer test-key');
  });

  it('throws when env vars are missing', async () => {
    delete process.env.RESEND_API_KEY;
    await expect(sendBriefEmail('owner@example.com', 'Luna', 'en', 'abc123'))
      .rejects.toThrow('Missing Resend or app URL environment variables');
  });

  it('uses localized subject for Spanish', async () => {
    await sendBriefEmail('owner@example.com', 'Luna', 'es', 'abc123');
    const body = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(body.subject).toBe('El furbrief de Luna está listo');
  });
});
