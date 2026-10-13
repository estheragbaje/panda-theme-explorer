// The single list of themes. Read by panda.config, the head script, the rail and tests.
// A theme appears here only once its file exists in ./themes.
export const THEMES = [
  { id: 'everyday', label: 'Everyday', note: 'normal', monogram: 'Ev' },
  { id: 'sketch', label: 'Sketch', note: 'handwritten', monogram: 'Sk' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

export const DEFAULT_THEME: ThemeId = 'everyday'

export const THEME_IDS: ThemeId[] = THEMES.map((theme) => theme.id)

// Light is the default. Only an explicit choice is stored; light removes the key.
export type Mode = 'light' | 'dark'
export const MODE_STORAGE_KEY = 'pt-mode'
export const THEME_STORAGE_KEY = 'pt-theme'
