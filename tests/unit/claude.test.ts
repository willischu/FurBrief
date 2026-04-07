import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const textContent = { type: 'text' as const, text: 'post-op instructions for luna the dog' };
const imageContent = {
  type: 'image' as const,
  source: { type: 'base64' as const, media_type: 'image/jpeg', data: 'abc123' },
};

describe('generateFurbrief — mock mode', () => {
  beforeEach(() => {
    process.env.MOCK_CLAUDE = 'true';
    vi.useFakeTimers();
  });

  afterEach(() => {
    delete process.env.MOCK_CLAUDE;
    vi.useRealTimers();
    vi.resetModules();
  });

  it('returns mock brief without calling Anthropic', async () => {
    const { generateFurbrief } = await import('../../lib/claude');
    const promise = generateFurbrief(textContent, 'Luna', 'dog', 'spay', 'en');
    vi.advanceTimersByTime(3000);
    const brief = await promise;

    expect(brief).toHaveProperty('day_schedule');
    expect(brief).toHaveProperty('medications');
    expect(brief).toHaveProperty('warning_signs');
    expect(brief).toHaveProperty('normal_things');
    expect(brief).toHaveProperty('follow_up');
  });

  it('mock brief has expected day_schedule structure', async () => {
    const { generateFurbrief } = await import('../../lib/claude');
    const promise = generateFurbrief(textContent, 'Luna', 'dog', 'spay', 'en');
    vi.advanceTimersByTime(3000);
    const brief = await promise;

    expect(Array.isArray(brief.day_schedule)).toBe(true);
    expect(brief.day_schedule.length).toBeGreaterThan(0);
    expect(brief.day_schedule[0]).toHaveProperty('period');
    expect(brief.day_schedule[0]).toHaveProperty('instructions');
    expect(Array.isArray(brief.day_schedule[0].instructions)).toBe(true);
  });

  it('mock brief has valid warning_signs with urgency', async () => {
    const { generateFurbrief } = await import('../../lib/claude');
    const promise = generateFurbrief(textContent, 'Luna', 'dog', 'spay', 'en');
    vi.advanceTimersByTime(3000);
    const brief = await promise;

    const validUrgencies = ['call_now', 'watch_closely', 'mention_at_checkup'];
    for (const sign of brief.warning_signs) {
      expect(sign).toHaveProperty('sign');
      expect(validUrgencies).toContain(sign.urgency);
    }
  });

  it('mock brief works with image content', async () => {
    const { generateFurbrief } = await import('../../lib/claude');
    const promise = generateFurbrief(imageContent, 'Mochi', 'cat', 'dental', 'ko');
    vi.advanceTimersByTime(3000);
    const brief = await promise;
    expect(brief).toHaveProperty('day_schedule');
  });
});

describe('generateFurbrief — real mode', () => {
  beforeEach(() => {
    delete process.env.MOCK_CLAUDE;
    delete process.env.ANTHROPIC_API_KEY;
    vi.resetModules();
  });

  it('throws when ANTHROPIC_API_KEY is missing', async () => {
    const { generateFurbrief } = await import('../../lib/claude');
    await expect(generateFurbrief(textContent, 'Luna', 'dog', 'spay', 'en'))
      .rejects.toThrow('Missing ANTHROPIC_API_KEY');
  });
});
