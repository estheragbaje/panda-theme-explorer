// The single list of themes. Read by panda.config, the head script, the rail and tests.
// A theme appears here only once its file exists in ./themes.
export const THEMES = [
  { id: 'everyday', label: 'Everyday', note: 'normal', monogram: 'Ev' },
  { id: 'riso', label: 'Riso', note: 'print', monogram: 'Ri' },
  { id: 'pixel', label: 'Pixel', note: 'handheld', monogram: 'Px' },
  { id: 'panda', label: 'Panda', note: 'soft, black and white', monogram: 'Pa' },
  { id: 'blueprint', label: 'Blueprint', note: 'technical', monogram: 'Bp' },
  { id: 'sketch', label: 'Sketch', note: 'handwritten', monogram: 'Sk' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

export const DEFAULT_THEME: ThemeId = 'everyday'

export const THEME_IDS: ThemeId[] = THEMES.map((theme) => theme.id)

// Light is the default. Only an explicit choice is stored; light removes the key.
export type Mode = 'light' | 'dark'
export const MODE_STORAGE_KEY = 'pt-mode'
export const THEME_STORAGE_KEY = 'pt-theme'

// The explorer's panel layout (rail width or collapsed, inspector width or closed). The
// head script reads it too, so the panels paint at their stored sizes before hydration.
export const LAYOUT_STORAGE_KEY = 'pt-layout'
export const PANEL_SIZES = {
  rail: { default: 248, min: 200, max: 320, collapsed: 80 },
  inspector: { default: 320, min: 260, max: 440 },
  // The resize gutters between panels, and the explorer's side padding around them (md up).
  gutter: 16,
  inset: 16,
  // Below this width (md) the panels are hidden: the rail is a strip, the inspector a drawer.
  minViewport: 768,
} as const
