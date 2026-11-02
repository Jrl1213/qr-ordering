import type { LocalText, OptionGroup } from './types';

// Option groups that many shops share, so the wording is written once.

const spiceLabels: Record<'none' | 'mild' | 'medium' | 'hot', LocalText> = {
  none: { en: 'No spice', zh: '不辣', ms: 'Tidak pedas' },
  mild: { en: 'Mild', zh: '微辣', ms: 'Sedikit' },
  medium: { en: 'Medium', zh: '中辣', ms: 'Sederhana' },
  hot: { en: 'Hot', zh: '大辣', ms: 'Pedas' },
};

export type SpiceLevel = keyof typeof spiceLabels;

// A "Spice level" group with the levels you list, in that order (the first is the default).
// Example: spiceGroup(['none', 'mild', 'medium'])
export const spiceGroup = (levels: SpiceLevel[]): OptionGroup => ({
  id: 'spice',
  label: { en: 'Spice level', zh: '辣度', ms: 'Tahap pedas' },
  choices: levels.map((level) => ({ id: level, label: spiceLabels[level], price: 0 })),
});
