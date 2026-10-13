// The standalone define entry has no Node dependencies, so the inspector can import the
// theme objects in the browser.
import { defineThemeContract } from '@pandacss/dev/define'

// Every token a theme must define. Components only ever read these names, so a theme
// is complete when it fills in this shape. Leaving a key out is a type error.
//
// Colors, shadows and assets take { base, _dark }. accent, neutral, danger, success
// and warning share the same keys so they work as a colorPalette.
const palette = { solid: {}, contrast: {}, subtle: {}, text: {} }

export const defineTheme = defineThemeContract({
  semanticTokens: {
    colors: {
      bg: { canvas: {}, surface: {}, subtle: {}, card: {}, overlay: {}, inverse: {} },
      fg: { default: {}, muted: {}, subtle: {}, inverse: {} },
      border: { default: {}, strong: {} },
      accent: palette,
      neutral: palette,
      danger: palette,
      success: palette,
      warning: palette,
      highlight: { bg: {}, fg: {} },
      focusRing: {},
    },
    fonts: { display: {}, body: {}, mono: {}, numeric: {} },
    fontSizes: { body: {} },
    fontWeights: { display: {}, button: {} },
    letterSpacings: { display: {}, button: {} },
    radii: { control: {}, card: {}, badge: {}, mark: {} },
    borderWidths: { control: {}, card: {}, rowMarker: {}, focus: {} },
    // The full outline of cards and surfaces, so a theme can change its style (Blueprint's
    // dashed frames), not only its width and color.
    borders: { frame: {} },
    shadows: { raised: {}, overlay: {}, control: {}, pressed: {} },
    // Decorative slots. 'none' in themes that don't use them.
    assets: { canvas: {}, edge: {}, ears: {}, cardMark: {} },
    sizes: { control: { sm: {}, md: {}, lg: {} }, canvasTile: {}, edge: {}, ears: {} },
    spacing: { inset: {}, press: {} },
    durations: { fast: {}, base: {} },
    easings: { standard: {}, emphasized: {} },
  },
})
