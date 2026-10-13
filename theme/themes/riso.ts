import { defineTheme } from '../contract'

// Riso: risograph print. Fluorescent pink and federal blue on ink-navy outlines, hard
// offset shadows with no blur, pill controls. Solid buttons press down into their
// shadow (spacing.press with shadows.pressed). In dark mode the card shadow turns pink,
// like a misaligned second ink pass.
export const riso = defineTheme({
  semanticTokens: {
    colors: {
      bg: {
        canvas: { value: { base: '#F2F2EE', _dark: '#15172A' } },
        surface: { value: { base: '#FFFFFF', _dark: '#1F2240' } },
        subtle: { value: { base: '#E6E6DF', _dark: '#2A2E55' } },
        card: { value: { base: '{colors.bg.surface}', _dark: '{colors.bg.surface}' } },
        overlay: { value: { base: '#FFFFFF', _dark: '#262A4C' } },
        inverse: { value: { base: '#1A1C33', _dark: '#F2F1FA' } },
      },
      fg: {
        default: { value: { base: '#1A1C33', _dark: '#F2F1FA' } },
        muted: { value: { base: '#4A4D66', _dark: '#B7B9D3' } },
        subtle: { value: { base: '#6B6E87', _dark: '#8E91B3' } },
        inverse: { value: { base: '#FFFFFF', _dark: '#15172A' } },
      },
      // Ink navy linework; white linework in dark.
      border: {
        default: { value: { base: '#1A1C33', _dark: '#C9C8DC' } },
        strong: { value: { base: '#1A1C33', _dark: '#F2F1FA' } },
      },
      // Fluorescent pink with navy text, and federal blue as the second ink.
      accent: {
        solid: { value: { base: '#F0359F', _dark: '#FF6CC0' } },
        contrast: { value: { base: '#1A1C33', _dark: '#15172A' } },
        subtle: { value: { base: '#D9E2F7', _dark: '#26386B' } },
        text: { value: { base: '#2A4791', _dark: '#B9CCFF' } },
      },
      neutral: {
        solid: { value: { base: '#1A1C33', _dark: '#F2F1FA' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#15172A' } },
        subtle: { value: { base: '#E6E6DF', _dark: '#2A2E55' } },
        text: { value: { base: '#2E3150', _dark: '#D6D6E8' } },
      },
      danger: {
        solid: { value: { base: '#B3261E', _dark: '#FF9A8F' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#2A0F0C' } },
        subtle: { value: { base: '#FFE1DC', _dark: '#46202A' } },
        text: { value: { base: '#9C2019', _dark: '#FFB4AB' } },
      },
      success: {
        solid: { value: { base: '#00785A', _dark: '#4FD8AE' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#06201A' } },
        subtle: { value: { base: '#CFF3E6', _dark: '#173D3A' } },
        text: { value: { base: '#006049', _dark: '#86E6C6' } },
      },
      warning: {
        solid: { value: { base: '#B04A00', _dark: '#FFB067' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#2A1606' } },
        subtle: { value: { base: '#FFE6C7', _dark: '#47331F' } },
        text: { value: { base: '#8A3A00', _dark: '#FFC891' } },
      },
      highlight: {
        bg: { value: { base: '#FFC2E4', _dark: '#FF6CC0' } },
        fg: { value: { base: '#1A1C33', _dark: '#15172A' } },
      },
      focusRing: { value: { base: '#2A4791', _dark: '#B9CCFF' } },
    },
    fonts: {
      display: { value: 'var(--font-bricolage), ui-sans-serif, system-ui, sans-serif' },
      body: { value: 'var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif' },
      mono: { value: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace' },
      numeric: { value: 'var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif' },
    },
    fontSizes: { body: { value: '0.9375rem' } },
    fontWeights: { display: { value: '700' }, button: { value: '600' } },
    letterSpacings: { display: { value: '-0.02em' }, button: { value: '0em' } },
    radii: { control: { value: '9999px' }, card: { value: '14px' }, badge: { value: '9999px' }, mark: { value: '5px' } },
    borderWidths: { control: { value: '2px' }, card: { value: '2px' }, rowMarker: { value: '0px' }, focus: { value: '2px' } },
    borders: { frame: { value: '{borderWidths.card} solid {colors.border.default}' } },
    // Hard offsets, no blur. The pressed shadow is zero, so with the 3px press the
    // button lands on its shadow.
    shadows: {
      raised: { value: { base: '5px 5px 0 #1A1C33', _dark: '5px 5px 0 #FF6CC0' } },
      overlay: { value: { base: '6px 6px 0 #1A1C33', _dark: '6px 6px 0 #FF6CC0' } },
      control: { value: { base: '3px 3px 0 #1A1C33', _dark: '3px 3px 0 #F2F1FA' } },
      pressed: { value: { base: '0 0 0 #1A1C33', _dark: '0 0 0 #F2F1FA' } },
    },
    assets: {
      canvas: { value: { base: 'none', _dark: 'none' } },
      edge: { value: { base: 'none', _dark: 'none' } },
      ears: { value: { base: 'none', _dark: 'none' } },
      cardMark: { value: { base: 'none', _dark: 'none' } },
    },
    sizes: {
      control: { sm: { value: '2rem' }, md: { value: '2.25rem' }, lg: { value: '2.75rem' } },
      canvasTile: { value: 'auto' },
      edge: { value: '0px' },
      ears: { value: '0px' },
    },
    spacing: { inset: { value: '1.125rem' }, press: { value: '3px' } },
    durations: { fast: { value: '160ms' }, base: { value: '220ms' } },
    easings: {
      standard: { value: 'cubic-bezier(0.2, 0, 0, 1)' },
      // A small overshoot, like paper settling after the press.
      emphasized: { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
  },
})
