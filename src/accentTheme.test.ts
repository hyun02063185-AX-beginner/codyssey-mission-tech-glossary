import { describe, expect, it } from 'vitest';
import { ACCENT_THEME_STORAGE_KEY, isAccentTheme, storedAccentTheme } from './accentTheme';

describe('accent theme preference', () => {
  it('only accepts the five shipped presets', () => {
    expect(isAccentTheme('forest')).toBe(true);
    expect(isAccentTheme('paper')).toBe(true);
    expect(isAccentTheme('ocean')).toBe(false);
    expect(isAccentTheme('unknown-theme')).toBe(false);
  });

  it('uses Forest for missing or invalid saved values', () => {
    expect(storedAccentTheme({ getItem: () => null })).toBe('forest');
    expect(storedAccentTheme({ getItem: () => 'unknown-theme' })).toBe('forest');
    expect(storedAccentTheme({ getItem: key => key === ACCENT_THEME_STORAGE_KEY ? 'indigo' : null })).toBe('indigo');
  });
});
