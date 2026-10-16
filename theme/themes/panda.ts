import { defineTheme } from '../contract'

// Panda: a panda, in Panda CSS colors. Every card is Panda yellow (#F6E458, from
// panda-css.com) with black text, two round black ears peeking over its top edge and a
// paw print pressed softly into its corner. Primary buttons are panda black, and a faint
// trail of paw prints wanders across the white canvas. Soft and round: pill controls,
// 28px cards, a warm cloud shadow, and controls that squish on press. Dark mode flips
// the coat: black-fur cards, white ears and paw, yellow primary buttons.
//
// Ears and paws stay on cards and the canvas; buttons, inputs and badges get none.

const paw = (fill: string, opacity: number) =>
  `<g fill='${fill}' fill-opacity='${opacity}'><ellipse cx='14' cy='26' rx='6' ry='7.5' transform='rotate(-20 14 26)'/><ellipse cx='26' cy='15' rx='6.5' ry='8'/><ellipse cx='39' cy='15' rx='6.5' ry='8'/><ellipse cx='51' cy='26' rx='6' ry='7.5' transform='rotate(20 51 26)'/><path d='M32.5 32c9 0 17 8.5 17 15.5 0 6-5 9-10 9-3.2 0-4.8-1.6-7-1.6s-3.8 1.6-7 1.6c-5 0-10-3-10-9 0-7 8-15.5 17-15.5z'/></g>`

const svg = (viewBox: string, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'>${body}</svg>`)}")`

// One paw for the card corner.
const cardMark = (fill: string, opacity: number) => svg('0 0 64 64', paw(fill, opacity))

// A trail: two small paws per 140px tile, offset and turned, so the repeat wanders.
const trail = (fill: string, opacity: number) =>
  svg(
    '0 0 140 140',
    `<g transform='translate(12 14) scale(0.45) rotate(-12 32 32)'>${paw(fill, opacity)}</g><g transform='translate(82 84) scale(0.45) rotate(18 32 32)'>${paw(fill, opacity)}</g>`,
  )

// Two round ears, cut flat by the card's top edge (the box they're drawn in ends there).
const ears = (color: string) =>
  ['2.75rem', 'calc(100% - 2.75rem)']
    .map((x) => `radial-gradient(circle at ${x} calc(100% - 0.375rem), ${color} 1.125rem, transparent calc(1.125rem + 1px))`)
    .join(', ')

export const panda = defineTheme({
  semanticTokens: {
    colors: {
      bg: {
        canvas: { value: { base: '#F7F7F5', _dark: '#121212' } },
        surface: { value: { base: '#FFFFFF', _dark: '#262626' } },
        subtle: { value: { base: '#EEEEEA', _dark: '#333333' } },
        // Panda yellow fur in light, black fur in dark.
        card: { value: { base: '#F6E458', _dark: '#1E1E1E' } },
        overlay: { value: { base: '#FFFFFF', _dark: '#2A2A2A' } },
        inverse: { value: { base: '#1A1A1A', _dark: '#F2F2EF' } },
      },
      fg: {
        default: { value: { base: '#1A1A1A', _dark: '#F2F2EF' } },
        muted: { value: { base: '#4A4A46', _dark: '#ABABA6' } },
        subtle: { value: { base: '#6B6B66', _dark: '#878782' } },
        inverse: { value: { base: '#FFFFFF', _dark: '#121212' } },
      },
      // Quiet grey dividers; the black coat outline is border.strong.
      border: {
        default: { value: { base: '#D9D9D2', _dark: '#3A3A3A' } },
        strong: { value: { base: '#1A1A1A', _dark: '#6A6A65' } },
      },
      // Panda black, with pale yellow as its subtle fill. Yellow takes over in dark.
      accent: {
        solid: { value: { base: '#1A1A1A', _dark: '#F6E458' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#1A1A1A' } },
        subtle: { value: { base: '#FFF6B8', _dark: '#3A3618' } },
        text: { value: { base: '#1A1A1A', _dark: '#F6E458' } },
      },
      neutral: {
        solid: { value: { base: '#1A1A1A', _dark: '#F2F2EF' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#121212' } },
        subtle: { value: { base: '#EEEEEA', _dark: '#333333' } },
        text: { value: { base: '#2E2E2B', _dark: '#D6D6D2' } },
      },
      danger: {
        solid: { value: { base: '#A3261E', _dark: '#FF9C92' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#2A0F0C' } },
        subtle: { value: { base: '#FDE3E0', _dark: '#3A1A18' } },
        text: { value: { base: '#8E1F18', _dark: '#FFB3AB' } },
      },
      success: {
        solid: { value: { base: '#2E7D32', _dark: '#86D98A' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#0E2410' } },
        subtle: { value: { base: '#E2F3E3', _dark: '#1C3320' } },
        text: { value: { base: '#1F5E23', _dark: '#A6E6A9' } },
      },
      warning: {
        solid: { value: { base: '#9A5200', _dark: '#F5B86B' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#2A1A06' } },
        subtle: { value: { base: '#FCE9C8', _dark: '#3A2C14' } },
        text: { value: { base: '#7A4300', _dark: '#F8CC92' } },
      },
      highlight: {
        bg: { value: { base: '#F6E458', _dark: '#F6E458' } },
        fg: { value: { base: '#1A1A1A', _dark: '#1A1A1A' } },
      },
      focusRing: { value: { base: '#1A1A1A', _dark: '#F6E458' } },
    },
    fonts: {
      display: { value: 'var(--font-m-plus-rounded), ui-rounded, system-ui, sans-serif' },
      body: { value: 'var(--font-m-plus-rounded), ui-rounded, system-ui, sans-serif' },
      mono: { value: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace' },
      numeric: { value: 'var(--font-m-plus-rounded), ui-rounded, system-ui, sans-serif' },
      badge: { value: '{fonts.body}' },
    },
    fontSizes: { body: { value: '0.9375rem' } },
    fontWeights: { display: { value: '800' }, button: { value: '500' } },
    letterSpacings: { display: { value: '-0.01em' }, button: { value: '0em' } },
    radii: { control: { value: '9999px' }, card: { value: '28px' }, badge: { value: '9999px' }, mark: { value: '6px' } },
    borderWidths: { control: { value: '1.5px' }, card: { value: '1.5px' }, rowMarker: { value: '0px' }, focus: { value: '2px' } },
    // Cards carry the coat's black outline.
    borders: { frame: { value: '{borderWidths.card} solid {colors.border.strong}' } },
    shadows: {
      // Warm and wide, like a cloud under the yellow card.
      raised: {
        value: {
          base: '0 2px 0 rgba(26, 26, 26, 0.06), 0 18px 40px -14px rgba(120, 100, 0, 0.35)',
          _dark: '0 18px 40px -16px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        },
      },
      overlay: {
        value: { base: '0 16px 40px -12px rgba(26, 26, 26, 0.28)', _dark: '0 16px 40px -12px rgba(0, 0, 0, 0.8)' },
      },
      control: { value: { base: '0 6px 14px -6px rgba(26, 26, 26, 0.5)', _dark: '0 6px 16px -8px rgba(246, 228, 88, 0.45)' } },
      pressed: { value: { base: '0 2px 6px -2px rgba(26, 26, 26, 0.5)', _dark: '0 2px 8px -4px rgba(246, 228, 88, 0.45)' } },
    },
    assets: {
      canvas: { value: { base: trail('#1A1A1A', 0.045), _dark: trail('#FFFFFF', 0.04) } },
      edge: { value: { base: 'none', _dark: 'none' } },
      ears: { value: { base: ears('#1A1A1A'), _dark: ears('#EDEDEA') } },
      cardMark: { value: { base: cardMark('#1A1A1A', 0.1), _dark: cardMark('#FFFFFF', 0.07) } },
    },
    sizes: {
      control: { sm: { value: '2.25rem' }, md: { value: '2.5rem' }, lg: { value: '3rem' } },
      canvasTile: { value: '140px 140px' },
      edge: { value: '0px' },
      ears: { value: '1.5rem' },
    },
    spacing: { inset: { value: '1.375rem' }, press: { value: '0px' } },
    durations: { fast: { value: '200ms' }, base: { value: '260ms' } },
    easings: {
      standard: { value: 'cubic-bezier(0.2, 0, 0, 1)' },
      emphasized: { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
  },
})
