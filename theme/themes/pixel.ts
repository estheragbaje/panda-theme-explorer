import { defineTheme } from '../contract'

// Pixel: a late-80s handheld game screen. Four shades of pea green, a faint LCD dot grid,
// 3px outlines, square corners, and bevelled buttons that sink in when pressed (the
// pressed shadow is the bevel flipped). Motion moves in steps, not curves. Danger is the
// one off-palette color, a brick red. Dark mode is the backlit version: a black screen
// with glowing green pixels.
//
// The pixel face carries headings, buttons and figures; body text is Martian Mono.

const dots = (dot: string) => `radial-gradient(${dot} 1px, transparent 1.2px)`

export const pixel = defineTheme({
  semanticTokens: {
    colors: {
      bg: {
        canvas: { value: { base: '#C9D6A0', _dark: '#0D150D' } },
        surface: { value: { base: '#DDE7B6', _dark: '#142114' } },
        subtle: { value: { base: '#B9C78C', _dark: '#1E301C' } },
        card: { value: { base: '{colors.bg.surface}', _dark: '{colors.bg.surface}' } },
        overlay: { value: { base: '#E8F0C6', _dark: '#1A2A18' } },
        inverse: { value: { base: '#0F380F', _dark: '#C6DE8C' } },
      },
      fg: {
        default: { value: { base: '#0F380F', _dark: '#C6DE8C' } },
        muted: { value: { base: '#2A4722', _dark: '#9BB878' } },
        subtle: { value: { base: '#46663A', _dark: '#748F5A' } },
        inverse: { value: { base: '#E8F0C6', _dark: '#0D150D' } },
      },
      border: {
        default: { value: { base: '#0F380F', _dark: '#6E8C1C' } },
        strong: { value: { base: '#0F380F', _dark: '#9BBC0F' } },
      },
      accent: {
        solid: { value: { base: '#306230', _dark: '#9BBC0F' } },
        contrast: { value: { base: '#E8F0C6', _dark: '#0D150D' } },
        subtle: { value: { base: '#A8BE72', _dark: '#26381A' } },
        text: { value: { base: '#0F380F', _dark: '#B8D84A' } },
      },
      neutral: {
        solid: { value: { base: '#0F380F', _dark: '#C6DE8C' } },
        contrast: { value: { base: '#E8F0C6', _dark: '#0D150D' } },
        subtle: { value: { base: '#B9C78C', _dark: '#1E301C' } },
        text: { value: { base: '#0F380F', _dark: '#C6DE8C' } },
      },
      // Brick red: the only color outside the four greens.
      danger: {
        solid: { value: { base: '#8E2A1E', _dark: '#E0846E' } },
        contrast: { value: { base: '#E8F0C6', _dark: '#0D150D' } },
        subtle: { value: { base: '#E3B9A3', _dark: '#3A1A12' } },
        text: { value: { base: '#6E1F14', _dark: '#F0A08C' } },
      },
      success: {
        solid: { value: { base: '#306230', _dark: '#9BBC0F' } },
        contrast: { value: { base: '#E8F0C6', _dark: '#0D150D' } },
        subtle: { value: { base: '#A8BE72', _dark: '#26381A' } },
        text: { value: { base: '#0F380F', _dark: '#B8D84A' } },
      },
      warning: {
        solid: { value: { base: '#6B4A08', _dark: '#D9B44A' } },
        contrast: { value: { base: '#E8F0C6', _dark: '#0D150D' } },
        subtle: { value: { base: '#D6C27E', _dark: '#33300F' } },
        text: { value: { base: '#4F3606', _dark: '#E8CC6A' } },
      },
      highlight: {
        bg: { value: { base: '#0F380F', _dark: '#9BBC0F' } },
        fg: { value: { base: '#DDE7B6', _dark: '#0D150D' } },
      },
      focusRing: { value: { base: '#0F380F', _dark: '#C6DE8C' } },
    },
    fonts: {
      display: { value: 'var(--font-pixelify), ui-monospace, monospace' },
      body: { value: 'var(--font-martian-mono), ui-monospace, SFMono-Regular, Menlo, monospace' },
      mono: { value: 'var(--font-martian-mono), ui-monospace, SFMono-Regular, Menlo, monospace' },
      numeric: { value: 'var(--font-pixelify), ui-monospace, monospace' },
      // Martian Mono is too wide for a badge beside a price; the pixel face is compact.
      badge: { value: '{fonts.display}' },
    },
    // Martian Mono is wide, so body text is set small.
    fontSizes: { body: { value: '0.8125rem' } },
    fontWeights: { display: { value: '600' }, button: { value: '600' } },
    letterSpacings: { display: { value: '0.02em' }, button: { value: '0.04em' } },
    radii: { control: { value: '0px' }, card: { value: '0px' }, badge: { value: '0px' }, mark: { value: '0px' } },
    borderWidths: { control: { value: '3px' }, card: { value: '3px' }, rowMarker: { value: '0px' }, focus: { value: '3px' } },
    borders: { frame: { value: '{borderWidths.card} solid {colors.border.default}' } },
    // Bevels: light top-left, dark bottom-right. Pressed flips them, so the button sinks.
    shadows: {
      raised: {
        value: {
          base: 'inset -4px -4px 0 rgba(15, 56, 15, 0.22), inset 4px 4px 0 rgba(255, 255, 255, 0.35)',
          _dark: 'inset -4px -4px 0 rgba(0, 0, 0, 0.35), inset 4px 4px 0 rgba(155, 188, 15, 0.10)',
        },
      },
      overlay: { value: { base: '4px 4px 0 #0F380F', _dark: '4px 4px 0 #000000' } },
      control: {
        value: {
          base: 'inset -3px -3px 0 rgba(0, 0, 0, 0.3), inset 3px 3px 0 rgba(255, 255, 255, 0.22)',
          _dark: 'inset -3px -3px 0 rgba(0, 0, 0, 0.3), inset 3px 3px 0 rgba(255, 255, 255, 0.25)',
        },
      },
      pressed: {
        value: {
          base: 'inset 3px 3px 0 rgba(0, 0, 0, 0.3), inset -3px -3px 0 rgba(255, 255, 255, 0.22)',
          _dark: 'inset 3px 3px 0 rgba(0, 0, 0, 0.3), inset -3px -3px 0 rgba(255, 255, 255, 0.25)',
        },
      },
    },
    assets: {
      canvas: { value: { base: dots('rgba(15, 56, 15, 0.10)'), _dark: dots('rgba(155, 188, 15, 0.07)') } },
      edge: { value: { base: 'none', _dark: 'none' } },
      ears: { value: { base: 'none', _dark: 'none' } },
      cardMark: { value: { base: 'none', _dark: 'none' } },
    },
    sizes: {
      control: { sm: { value: '2.125rem' }, md: { value: '2.375rem' }, lg: { value: '2.875rem' } },
      canvasTile: { value: '4px 4px' },
      edge: { value: '0px' },
      ears: { value: '0px' },
    },
    spacing: { inset: { value: '1.125rem' }, press: { value: '0px' } },
    durations: { fast: { value: '160ms' }, base: { value: '200ms' } },
    easings: {
      standard: { value: 'steps(4, end)' },
      emphasized: { value: 'steps(4, end)' },
    },
  },
})
