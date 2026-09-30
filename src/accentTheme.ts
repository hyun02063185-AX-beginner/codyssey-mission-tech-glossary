export const ACCENT_THEME_STORAGE_KEY = 'codyssey-accent-theme';

export const ACCENT_THEMES = ['forest', 'indigo', 'paper', 'signal'] as const;
export type AccentTheme = typeof ACCENT_THEMES[number];

export const ACCENT_THEME_LABELS: Record<AccentTheme, string> = {
  forest: 'Forest', indigo: 'Indigo', paper: 'Paper', signal: 'Signal',
};

export function isAccentTheme(value: string | null): value is AccentTheme {
  return value !== null && (ACCENT_THEMES as readonly string[]).includes(value);
}

export function storedAccentTheme(storage: Pick<Storage, 'getItem'> | null = typeof localStorage === 'undefined' ? null : localStorage): AccentTheme {
  try {
    const value = storage?.getItem(ACCENT_THEME_STORAGE_KEY) ?? null;
    return isAccentTheme(value) ? value : 'forest';
  } catch {
    return 'forest';
  }
}

export function applyAccentTheme(theme: AccentTheme, storage: Pick<Storage, 'setItem'> | null = typeof localStorage === 'undefined' ? null : localStorage) {
  document.documentElement.dataset.accentTheme = theme;
  try { storage?.setItem(ACCENT_THEME_STORAGE_KEY, theme); } catch { /* storage is optional */ }
}
