import { defineTheme } from '../contract'

// Blueprint: a technical drawing. Square corners, dashed frames around cards and
// surfaces, a faint drafting grid, monospace headings and buttons. No shadows: the
// structure comes from lines. Motion is short and linear; nothing bounces. Dark mode is
// the classic blueprint: pale linework on deep ultramarine.

const grid = (line: string) => `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`

export const blueprint = defineTheme({
  semanticTokens: {
    colors: {
      bg: {
        canvas: { value: { base: '#F4F8FC', _dark: '#0B2440' } },
        surface: { value: { base: '#FFFFFF', _dark: '#0F2D50' } },
        subtle: { value: { base: '#E2ECF7', _dark: '#143761' } },
        card: { value: { base: '{colors.bg.surface}', _dark: '{colors.bg.surface}' } },
        overlay: { value: { base: '#FFFFFF', _dark: '#12345C' } },
        inverse: { value: { base: '#0B2440', _dark: '#E3EEFA' } },
      },
      fg: {
        default: { value: { base: '#0B2440', _dark: '#E3EEFA' } },
        muted: { value: { base: '#3F5B7A', _dark: '#A3BCD6' } },
        subtle: { value: { base: '#5F7C9C', _dark: '#7F9DBF' } },
        inverse: { value: { base: '#FFFFFF', _dark: '#0B2440' } },
      },
      border: {
        default: { value: { base: '#8FAACB', _dark: '#4B78A8' } },
        strong: { value: { base: '#4F7099', _dark: '#7FA3CC' } },
      },
      accent: {
        solid: { value: { base: '#0050C8', _dark: '#7CC4FF' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#062038' } },
        subtle: { value: { base: '#DCE9FA', _dark: '#17406D' } },
        text: { value: { base: '#0047B3', _dark: '#B5DDFF' } },
      },
      neutral: {
        solid: { value: { base: '#0B2440', _dark: '#E3EEFA' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#0B2440' } },
        subtle: { value: { base: '#E2ECF7', _dark: '#143761' } },
        text: { value: { base: '#1F3B5C', _dark: '#C8D9EC' } },
      },
      danger: {
        solid: { value: { base: '#B3261E', _dark: '#FF9C94' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#2A0E0C' } },
        subtle: { value: { base: '#FBE5E3', _dark: '#3D2033' } },
        text: { value: { base: '#A1221B', _dark: '#FFB4AD' } },
      },
      success: {
        solid: { value: { base: '#1D6B45', _dark: '#6FD6A0' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#0A2418' } },
        subtle: { value: { base: '#DDF2E6', _dark: '#133D3A' } },
        text: { value: { base: '#17583A', _dark: '#9BE5BD' } },
      },
      warning: {
        solid: { value: { base: '#A3540A', _dark: '#F5B86B' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#2A1A06' } },
        subtle: { value: { base: '#FCEBD6', _dark: '#3A3326' } },
        text: { value: { base: '#8A4508', _dark: '#F8CC92' } },
      },
      highlight: {
        bg: { value: { base: '#DCE9FA', _dark: '#17406D' } },
        fg: { value: { base: '#0B2440', _dark: '#E3EEFA' } },
      },
      focusRing: { value: { base: '#0050C8', _dark: '#7CC4FF' } },
    },
    fonts: {
      display: { value: 'var(--font-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace' },
      body: { value: 'var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif' },
      mono: { value: 'var(--font-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace' },
      numeric: { value: 'var(--font-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace' },
      badge: { value: '{fonts.body}' },
    },
    fontSizes: { body: { value: '0.9375rem' } },
    fontWeights: { display: { value: '500' }, button: { value: '500' } },
    letterSpacings: { display: { value: '0.02em' }, button: { value: '0.04em' } },
    radii: { control: { value: '0px' }, card: { value: '0px' }, badge: { value: '0px' }, mark: { value: '0px' } },
    borderWidths: { control: { value: '1px' }, card: { value: '1px' }, rowMarker: { value: '0px' }, focus: { value: '2px' } },
    // The signature: every card and surface is a dashed frame.
    borders: { frame: { value: '{borderWidths.card} dashed {colors.border.default}' } },
    shadows: {
      raised: { value: { base: 'none', _dark: 'none' } },
      // Overlays sit on top of content, so they get a flat offset to separate them.
      overlay: { value: { base: '4px 4px 0 rgba(0, 80, 200, 0.14)', _dark: '4px 4px 0 rgba(0, 0, 0, 0.35)' } },
      control: { value: { base: 'none', _dark: 'none' } },
      pressed: { value: { base: 'none', _dark: 'none' } },
    },
    assets: {
      canvas: { value: { base: grid('rgba(0, 80, 200, 0.07)'), _dark: grid('rgba(124, 196, 255, 0.09)') } },
      edge: { value: { base: 'none', _dark: 'none' } },
      ears: { value: { base: 'none', _dark: 'none' } },
      cardMark: { value: { base: 'none', _dark: 'none' } },
    },
    sizes: {
      control: { sm: { value: '1.875rem' }, md: { value: '2.125rem' }, lg: { value: '2.5rem' } },
      canvasTile: { value: '16px 16px' },
      edge: { value: '0px' },
      ears: { value: '0px' },
    },
    spacing: { inset: { value: '1rem' }, press: { value: '0px' } },
    durations: { fast: { value: '80ms' }, base: { value: '120ms' } },
    easings: {
      standard: { value: 'linear' },
      emphasized: { value: 'linear' },
    },
  },
})
