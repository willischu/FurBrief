import { describe, it, expect } from 'vitest';
import { labels, footerStrings, languageNames } from '../../i18n/strings';

const LANGS = ['en', 'es', 'ko', 'zh'] as const;

describe('labels', () => {
  it('has all 4 languages', () => {
    for (const lang of LANGS) {
      expect(labels).toHaveProperty(lang);
    }
  });

  it('every language has the same keys', () => {
    const enKeys = Object.keys(labels.en).sort();
    for (const lang of LANGS) {
      expect(Object.keys(labels[lang]).sort()).toEqual(enKeys);
    }
  });

  it('no empty string values in any language', () => {
    for (const lang of LANGS) {
      for (const [key, value] of Object.entries(labels[lang])) {
        expect(value, `labels.${lang}.${key} is empty`).not.toBe('');
      }
    }
  });

  it('processing array has 4 items in every language', () => {
    for (const lang of LANGS) {
      expect(labels[lang].processing).toHaveLength(4);
    }
  });
});

describe('footerStrings', () => {
  it('has all 4 languages', () => {
    for (const lang of LANGS) {
      expect(footerStrings).toHaveProperty(lang);
    }
  });

  it('every language has tag, disc, and links', () => {
    for (const lang of LANGS) {
      expect(footerStrings[lang]).toHaveProperty('tag');
      expect(footerStrings[lang]).toHaveProperty('disc');
      expect(footerStrings[lang]).toHaveProperty('links');
    }
  });

  it('every language footer includes an about link', () => {
    for (const lang of LANGS) {
      const links = footerStrings[lang].links;
      const aboutLink = links.find((l) => l.href === '/about');
      expect(aboutLink, `footer for ${lang} missing /about link`).toBeDefined();
    }
  });

  it('every language footer includes a privacy link', () => {
    for (const lang of LANGS) {
      const links = footerStrings[lang].links;
      const privacyLink = links.find((l) => l.href === '/privacy');
      expect(privacyLink, `footer for ${lang} missing /privacy link`).toBeDefined();
    }
  });

  it('every language footer includes an upload link', () => {
    for (const lang of LANGS) {
      const links = footerStrings[lang].links;
      const uploadLink = links.find((l) => l.href === '/upload');
      expect(uploadLink, `footer for ${lang} missing /upload link`).toBeDefined();
    }
  });

  it('help link uses gmail compose URL', () => {
    for (const lang of LANGS) {
      const links = footerStrings[lang].links;
      const helpLink = links.find((l) => l.href.includes('mail.google.com'));
      expect(helpLink, `footer for ${lang} missing gmail help link`).toBeDefined();
      expect(helpLink!.href).toContain('furbrief@proton.me');
    }
  });

  it('all link labels are non-empty strings', () => {
    for (const lang of LANGS) {
      for (const link of footerStrings[lang].links) {
        expect(link.label).toBeTruthy();
        expect(link.href).toBeTruthy();
      }
    }
  });
});

describe('languageNames', () => {
  it('has all 4 languages', () => {
    for (const lang of LANGS) {
      expect(languageNames).toHaveProperty(lang);
      expect(languageNames[lang]).toBeTruthy();
    }
  });
});
