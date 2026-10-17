import { defineTheme } from '../contract'

// Everyday: the normal theme. A neutral grey with a faint green bias and one calm green
// accent, standard corners, a light shadow. No signature detail, by design: every other
// theme is measured against this one, and its values fill the root (:root).
export const everyday = defineTheme({
  semanticTokens: {
    colors: {
      bg: {
        canvas: { value: { base: '#F7F8F7', _dark: '#0F1211' } },
        surface: { value: { base: '#FFFFFF', _dark: '#161A18' } },
        subtle: { value: { base: '#ECEFEC', _dark: '#1F2421' } },
        card: { value: { base: '{colors.bg.surface}', _dark: '{colors.bg.surface}' } },
        overlay: { value: { base: '#FFFFFF', _dark: '#1C211E' } },
        sticky: { value: { base: '{colors.bg.canvas}', _dark: '{colors.bg.canvas}' } },
        inverse: { value: { base: '#161A17', _dark: '#E8ECE9' } },
      },
      fg: {
        default: { value: { base: '#161A17', _dark: '#E8ECE9' } },
        muted: { value: { base: '#59615B', _dark: '#9BA49E' } },
        subtle: { value: { base: '#737B75', _dark: '#7F8983' } },
        inverse: { value: { base: '#FFFFFF', _dark: '#0F1211' } },
      },
      border: {
        default: { value: { base: '#DDE1DD', _dark: '#2A302C' } },
        strong: { value: { base: '#C2C8C3', _dark: '#3A423D' } },
      },
      accent: {
        solid: { value: { base: '#1F7A4D', _dark: '#4CC38A' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#06180F' } },
        subtle: { value: { base: '#E2F2E8', _dark: '#15301F' } },
        text: { value: { base: '#17613C', _dark: '#7FD8AA' } },
      },
      neutral: {
        solid: { value: { base: '#161A17', _dark: '#E8ECE9' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#0F1211' } },
        subtle: { value: { base: '#ECEFEC', _dark: '#1F2421' } },
        text: { value: { base: '#3E4540', _dark: '#C5CCC7' } },
      },
      danger: {
        solid: { value: { base: '#B42318', _dark: '#F97066' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#1F0806' } },
        subtle: { value: { base: '#FDECEA', _dark: '#3A1916' } },
        text: { value: { base: '#B42318', _dark: '#FF8A80' } },
      },
      success: {
        solid: { value: { base: '#157F3B', _dark: '#5BD58A' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#062010' } },
        subtle: { value: { base: '#E3F5E9', _dark: '#13301D' } },
        text: { value: { base: '#116530', _dark: '#86E3A8' } },
      },
      warning: {
        solid: { value: { base: '#B45309', _dark: '#F5B544' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#2A1A02' } },
        subtle: { value: { base: '#FEF3E2', _dark: '#3A2A12' } },
        text: { value: { base: '#92400E', _dark: '#F7C66B' } },
      },
      highlight: {
        bg: { value: { base: '#E2F2E8', _dark: '#15301F' } },
        fg: { value: { base: '#17613C', _dark: '#7FD8AA' } },
      },
      focusRing: { value: { base: '#1F7A4D', _dark: '#4CC38A' } },
    },
    fonts: {
      display: { value: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif' },
      body: { value: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif' },
      mono: { value: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace' },
      numeric: { value: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif' },
      badge: { value: '{fonts.body}' },
    },
    fontSizes: { body: { value: '0.9375rem' } },
    fontWeights: { display: { value: '600' }, button: { value: '500' } },
    letterSpacings: { display: { value: '-0.015em' }, button: { value: '0em' } },
    radii: { control: { value: '8px' }, card: { value: '14px' }, badge: { value: '9999px' }, mark: { value: '5px' } },
    borderWidths: { control: { value: '1px' }, card: { value: '1px' }, rowMarker: { value: '0px' }, focus: { value: '2px' } },
    borders: { frame: { value: '{borderWidths.card} solid {colors.border.default}' } },
    shadows: {
      raised: {
        value: {
          base: '0 1px 2px rgba(22, 26, 23, 0.04)',
          _dark: '0 0 0 1px rgba(255, 255, 255, 0.02)',
        },
      },
      overlay: {
        value: {
          base: '0 12px 32px -8px rgba(22, 26, 23, 0.18), 0 2px 6px rgba(22, 26, 23, 0.06)',
          _dark: '0 16px 40px -8px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        },
      },
      control: { value: { base: '0 1px 2px rgba(22, 26, 23, 0.12)', _dark: 'none' } },
      pressed: { value: { base: 'none', _dark: 'none' } },
      field: { value: { base: 'none', _dark: 'none' } },
    },
    assets: {
      canvas: { value: { base: 'none', _dark: 'none' } },
      edge: { value: { base: 'none', _dark: 'none' } },
      cardMark: { value: { base: 'none', _dark: 'none' } },
    },
    sizes: {
      control: { sm: { value: '2rem' }, md: { value: '2.25rem' }, lg: { value: '2.75rem' } },
      canvasTile: { value: 'auto' },
      edge: { value: '0px' },
    },
    spacing: { inset: { value: '1.125rem' }, press: { value: '0px' } },
    durations: { fast: { value: '150ms' }, base: { value: '200ms' } },
    easings: {
      standard: { value: 'cubic-bezier(0.2, 0, 0, 1)' },
      emphasized: { value: 'cubic-bezier(0.2, 0, 0, 1)' },
    },
  },
})
