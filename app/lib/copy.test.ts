import { describe, expect, it } from 'vitest';
import { copy, getCopy } from './copy';

describe('getCopy', () => {
  it('mentions the ?table=1 trick only in demo mode', () => {
    expect(getCopy('en', true).noTableBody).toContain('?table=1');
    expect(getCopy('en', false).noTableBody).toBe('Please scan the QR code on your table.');
  });

  it('says nothing is submitted only in demo mode', () => {
    expect(getCopy('ms', true).previewBody).toContain('demo');
    expect(getCopy('ms', false).previewBody).not.toContain('demo');
  });

  it('keeps all other text the same', () => {
    expect(getCopy('zh', true).total).toBe(copy.zh.total);
    expect(getCopy('zh', false).total).toBe(copy.zh.total);
  });
});
