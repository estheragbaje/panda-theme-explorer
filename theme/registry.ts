// The single list of themes. Read by panda.config, the head script, the rail and tests.
// A theme appears here only once its file exists in ./themes.
export const THEMES = [
  { id: 'everyday', label: 'Everyday', note: 'normal', monogram: 'Ev' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

export const DEFAULT_THEME: ThemeId = 'everyday'

export const THEME_IDS: ThemeId[] = THEMES.map((theme) => theme.id)
