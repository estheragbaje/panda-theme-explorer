import { defineTheme } from '../contract'

// Sketch: a page from a notebook. Ruled lines and a red margin on the canvas, ballpoint
// blue, a 2px pencil outline instead of shadows, uneven hand-drawn corners. Every
// subtle fill is a highlighter color, so badges, alerts and tonal buttons read as
// highlighter marks. Dark mode is a chalkboard: slate green, chalk lines, chalk yellow.
//
// Handwriting carries headings and buttons; figures and code use Courier Prime so
// tables and prices stay legible.

// Ruled paper: a red margin line, then blue rules every 26px.
const ruled = [
  'linear-gradient(90deg, transparent 2.375rem, rgba(214, 72, 72, 0.28) 2.375rem, rgba(214, 72, 72, 0.28) calc(2.375rem + 1px), transparent calc(2.375rem + 1px))',
  'repeating-linear-gradient(180deg, transparent 0 25px, rgba(60, 110, 200, 0.16) 25px 26px)',
].join(', ')

// Chalk dust: two faint smudges where the board was wiped.
const chalkDust = [
  'radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.05), transparent 60%)',
  'radial-gradient(ellipse at 80% 90%, rgba(255, 255, 255, 0.04), transparent 55%)',
].join(', ')

export const sketch = defineTheme({
  semanticTokens: {
    colors: {
      bg: {
        canvas: { value: { base: '#FDFDFB', _dark: '#1D2A25' } },
        surface: { value: { base: '#FFFFFF', _dark: '#223129' } },
        subtle: { value: { base: '#EEEEE8', _dark: '#2C3D35' } },
        card: { value: { base: '{colors.bg.surface}', _dark: '{colors.bg.surface}' } },
        overlay: { value: { base: '#FFFFFF', _dark: '#2A3A32' } },
        inverse: { value: { base: '#2A2A2E', _dark: '#EDEBE0' } },
      },
      fg: {
        default: { value: { base: '#2A2A2E', _dark: '#EDEBE0' } },
        muted: { value: { base: '#55555D', _dark: '#B9BFB3' } },
        subtle: { value: { base: '#76767E', _dark: '#929C90' } },
        inverse: { value: { base: '#FDFDFB', _dark: '#1D2A25' } },
      },
      // Pencil for dividers, a firmer pencil for outlines. Chalk lines in dark.
      border: {
        default: { value: { base: '#5E5E66', _dark: '#8F998D' } },
        strong: { value: { base: '#2A2A2E', _dark: '#E9E7DB' } },
      },
      // Ballpoint blue, with highlighter yellow as its subtle fill.
      accent: {
        solid: { value: { base: '#2445A8', _dark: '#F2DA6B' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#1D2A25' } },
        subtle: { value: { base: '#FFF07A', _dark: '#4A4A2C' } },
        text: { value: { base: '#1E3A8F', _dark: '#F5E08A' } },
      },
      neutral: {
        solid: { value: { base: '#2A2A2E', _dark: '#EDEBE0' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#1D2A25' } },
        subtle: { value: { base: '#EEEEE8', _dark: '#2C3D35' } },
        text: { value: { base: '#3A3A40', _dark: '#D6DACE' } },
      },
      // Red pen, pink highlighter.
      danger: {
        solid: { value: { base: '#B42626', _dark: '#FF9E91' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#2A1210' } },
        subtle: { value: { base: '#FFD6CF', _dark: '#4A2C28' } },
        text: { value: { base: '#9E1F1F', _dark: '#FFB8AE' } },
      },
      // Green pen, green highlighter.
      success: {
        solid: { value: { base: '#2B7A2F', _dark: '#9BD88A' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#10240E' } },
        subtle: { value: { base: '#D2F5BE', _dark: '#2C4A2E' } },
        text: { value: { base: '#235F26', _dark: '#B8E8AA' } },
      },
      // Orange highlighter.
      warning: {
        solid: { value: { base: '#A84E08', _dark: '#F5B86B' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#2A1A06' } },
        subtle: { value: { base: '#FFDDA8', _dark: '#4A3A22' } },
        text: { value: { base: '#7E3A05', _dark: '#F8CC92' } },
      },
      highlight: {
        bg: { value: { base: '#FFF07A', _dark: '#F2DA6B' } },
        fg: { value: { base: '#2A2A2E', _dark: '#1D2A25' } },
      },
      focusRing: { value: { base: '#2445A8', _dark: '#F2DA6B' } },
    },
    fonts: {
      display: { value: 'var(--font-kalam), "Comic Sans MS", cursive' },
      body: { value: 'var(--font-patrick-hand), "Comic Sans MS", cursive' },
      mono: { value: 'var(--font-courier-prime), "Courier New", monospace' },
      numeric: { value: 'var(--font-courier-prime), "Courier New", monospace' },
    },
    // Patrick Hand has a small x-height, so body text is set a size up.
    fontSizes: { body: { value: '1.0625rem' } },
    // Patrick Hand has one weight; 400 avoids a synthesized bold on buttons.
    fontWeights: { display: { value: '700' }, button: { value: '400' } },
    letterSpacings: { display: { value: '0em' }, button: { value: '0.01em' } },
    // Eight-value radii: no two corners alike, so outlines look drawn by hand.
    radii: {
      control: { value: '255px 15px 225px 15px / 15px 225px 15px 255px' },
      card: { value: '255px 18px 225px 18px / 18px 225px 18px 255px' },
      badge: { value: '15px 5px 13px 4px / 4px 12px 5px 15px' },
      mark: { value: '6px 3px 5px 2px / 2px 5px 3px 6px' },
    },
    borderWidths: { control: { value: '2px' }, card: { value: '2px' }, rowMarker: { value: '0px' }, focus: { value: '2px' } },
    borders: { frame: { value: '{borderWidths.card} solid {colors.border.default}' } },
    // Flat: the pencil outline does the work. Overlays get an offset pencil shade so
    // they lift off the page without a blur.
    shadows: {
      raised: { value: { base: 'none', _dark: 'none' } },
      overlay: { value: { base: '3px 4px 0 rgba(42, 42, 46, 0.18)', _dark: '3px 4px 0 rgba(0, 0, 0, 0.35)' } },
      control: { value: { base: 'none', _dark: 'none' } },
      pressed: { value: { base: 'none', _dark: 'none' } },
    },
    assets: {
      canvas: { value: { base: ruled, _dark: chalkDust } },
      edge: { value: { base: 'none', _dark: 'none' } },
      ears: { value: { base: 'none', _dark: 'none' } },
      cardMark: { value: { base: 'none', _dark: 'none' } },
    },
    sizes: {
      control: { sm: { value: '2.125rem' }, md: { value: '2.375rem' }, lg: { value: '2.875rem' } },
      canvasTile: { value: 'auto' },
      edge: { value: '0px' },
      ears: { value: '0px' },
    },
    spacing: { inset: { value: '1.25rem' }, press: { value: '0px' } },
    durations: { fast: { value: '150ms' }, base: { value: '200ms' } },
    easings: {
      standard: { value: 'cubic-bezier(0.3, 0, 0.2, 1)' },
      emphasized: { value: 'cubic-bezier(0.3, 0, 0.2, 1)' },
    },
  },
})
