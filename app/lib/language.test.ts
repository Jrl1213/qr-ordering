import { describe, expect, it } from 'vitest';
import { parseSavedLanguage } from './language';

describe('parseSavedLanguage', () => {
  it('keeps a saved language the shop offers', () => {
    expect(parseSavedLanguage('ms', ['en', 'zh', 'ms'])).toBe('ms');
  });

  it('falls back to the first language when nothing is saved', () => {
    expect(parseSavedLanguage(null, ['en', 'ms'])).toBe('en');
  });

  it('falls back when the shop no longer offers the saved language', () => {
    expect(parseSavedLanguage('zh', ['en', 'ms'])).toBe('en');
  });

  it('ignores junk in storage', () => {
    expect(parseSavedLanguage('<script>', ['en', 'zh', 'ms'])).toBe('en');
  });
});
