import { defineTheme } from '../contract'

// Y2K: Windows 98/2000 with Internet Explorer 5. The trip page is a white web page;
// cards are grey windows with 3D bevels (a white top-left edge, a dark bottom-right
// edge) and a navy title bar fading to light blue, with minimise, maximise and close
// buttons. Fields are sunken, buttons are raised grey and sink when pressed, links are
// blue, progress fills in separate blocks, tooltips are pale yellow, and every corner is
// square. Tahoma, as on those systems.
//
// Dark mode is a classic dark scheme built on the same blues: black, white text and 1px
// white outlines, navy title bars, a Windows-blue selection and light blue links, with
// muted green, amber and red for status.

const TAHOMA = 'Tahoma, Verdana, "Segoe UI", Geneva, sans-serif'

// The three caption buttons, right-aligned in the title bar (the SVG keeps its height
// and sits at the right of the strip). face: button fill; hi and lo: bevel edges; ink: glyphs.
const captionButtons = (face: string, hi: string, lo: string, ink: string) => {
  const button = (x: number, glyph: string) =>
    `<g transform='translate(${x} 3)'><rect width='16' height='14' fill='${face}'/><path d='M0 13.5V0.5h15.5' stroke='${hi}' fill='none'/><path d='M0.5 13.5h15V0' stroke='${lo}' fill='none'/>${glyph}</g>`
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 58 20' preserveAspectRatio='xMaxYMid meet'>` +
    button(2, `<rect x='4' y='9' width='6' height='2' fill='${ink}'/>`) +
    button(18, `<rect x='3.5' y='2.5' width='8' height='7' fill='none' stroke='${ink}'/><rect x='3' y='2' width='9' height='2' fill='${ink}'/>`) +
    button(38, `<path d='M4 3l7 7M11 3l-7 7' stroke='${ink}' stroke-width='1.6'/>`) +
    `</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// Inset bevels, as Windows drew them: two lines on each side.
const RAISED = 'inset -1px -1px 0 #404040, inset 1px 1px 0 #FFFFFF, inset -2px -2px 0 #808080, inset 2px 2px 0 #E8E6E1'
const PRESSED = 'inset 1px 1px 0 #404040, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #808080, inset -2px -2px 0 #E8E6E1'
const SUNKEN = 'inset 1px 1px 0 #808080, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #404040'

export const y2k = defineTheme({
  semanticTokens: {
    colors: {
      bg: {
        // The web page is white; windows and toolbars are the grey "button face".
        canvas: { value: { base: '#FFFFFF', _dark: '#000000' } },
        surface: { value: { base: '#D4D0C8', _dark: '#000000' } },
        subtle: { value: { base: '#E4E1DA', _dark: '#1A1D29' } },
        card: { value: { base: '{colors.bg.surface}', _dark: '{colors.bg.surface}' } },
        overlay: { value: { base: '#FFFFFF', _dark: '#000000' } },
        // The sticky section nav: a grey menu bar.
        sticky: { value: { base: '#D4D0C8', _dark: '#000000' } },
        // Tooltips: pale yellow info tips (a black tip with white text in high contrast).
        inverse: { value: { base: '#FFFFE1', _dark: '#000000' } },
      },
      fg: {
        default: { value: { base: '#000000', _dark: '#FFFFFF' } },
        muted: { value: { base: '#404040', _dark: '#C0C0C0' } },
        subtle: { value: { base: '#5E5E5E', _dark: '#A0A0A0' } },
        inverse: { value: { base: '#000000', _dark: '#FFFFFF' } },
      },
      border: {
        default: { value: { base: '#808080', _dark: '#FFFFFF' } },
        strong: { value: { base: '#404040', _dark: '#FFFFFF' } },
      },
      // Navy selection and checked states, classic blue links. Dark mode keeps to the same
      // blues: a brighter Windows blue for selection, navy fills, light blue links.
      accent: {
        solid: { value: { base: '#0A246A', _dark: '#2C64C8' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#FFFFFF' } },
        subtle: { value: { base: '#C6D3EF', _dark: '#0E2554' } },
        text: { value: { base: '#0000EE', _dark: '#8EB6FF' } },
      },
      neutral: {
        solid: { value: { base: '#404040', _dark: '#FFFFFF' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#000000' } },
        subtle: { value: { base: '#E4E1DA', _dark: '#1A1D29' } },
        text: { value: { base: '#000000', _dark: '#FFFFFF' } },
      },
      danger: {
        solid: { value: { base: '#A00000', _dark: '#E5655E' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#000000' } },
        subtle: { value: { base: '#F7D7D7', _dark: '#3A1616' } },
        text: { value: { base: '#A00000', _dark: '#FF9E98' } },
      },
      success: {
        solid: { value: { base: '#006E00', _dark: '#5BBF73' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#000000' } },
        subtle: { value: { base: '#D6F0D6', _dark: '#12301C' } },
        text: { value: { base: '#005A00', _dark: '#8ED9A0' } },
      },
      warning: {
        solid: { value: { base: '#8A5A00', _dark: '#D9A441' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#000000' } },
        subtle: { value: { base: '#FFF2C6', _dark: '#36290D' } },
        text: { value: { base: '#704800', _dark: '#E9C77A' } },
      },
      highlight: {
        bg: { value: { base: '#0A246A', _dark: '#2C64C8' } },
        fg: { value: { base: '#FFFFFF', _dark: '#FFFFFF' } },
      },
      // The dotted-rectangle era: focus is black (white in high contrast).
      focusRing: { value: { base: '#000000', _dark: '#FFFFFF' } },
    },
    fonts: {
      display: { value: TAHOMA },
      body: { value: TAHOMA },
      mono: { value: '"Courier New", Courier, monospace' },
      numeric: { value: TAHOMA },
      badge: { value: '{fonts.body}' },
    },
    fontSizes: { body: { value: '0.8125rem' } },
    fontWeights: { display: { value: '700' }, button: { value: '400' } },
    letterSpacings: { display: { value: '0em' }, button: { value: '0em' } },
    radii: { control: { value: '0px' }, card: { value: '0px' }, badge: { value: '0px' }, mark: { value: '0px' } },
    borderWidths: { control: { value: '1px' }, card: { value: '1px' }, rowMarker: { value: '0px' }, focus: { value: '1px' } },
    // Windows draw their edge with bevels, not a border; high contrast outlines in white.
    borders: { frame: { value: { base: 'none', _dark: '1px solid #FFFFFF' } } },
    shadows: {
      raised: { value: { base: RAISED, _dark: 'none' } },
      overlay: { value: { base: `${RAISED}, 2px 2px 0 rgba(0, 0, 0, 0.35)`, _dark: 'none' } },
      control: { value: { base: RAISED, _dark: 'inset 0 0 0 1px #FFFFFF' } },
      pressed: { value: { base: PRESSED, _dark: 'inset 0 0 0 2px #FFFFFF' } },
      field: { value: { base: SUNKEN, _dark: 'none' } },
    },
    assets: {
      canvas: { value: { base: 'none', _dark: 'none' } },
      // The title bar: navy fading to light blue (a darker navy in high contrast).
      edge: {
        value: {
          base: `${captionButtons('#D4D0C8', '#FFFFFF', '#404040', '#000000')}, linear-gradient(90deg, #0A246A, #A6CAF0)`,
          _dark: `${captionButtons('#000000', '#FFFFFF', '#FFFFFF', '#FFFFFF')}, linear-gradient(90deg, #0A1F5C, #1B3F8F)`,
        },
      },
      cardMark: { value: { base: 'none', _dark: 'none' } },
    },
    sizes: {
      control: { sm: { value: '1.625rem' }, md: { value: '1.875rem' }, lg: { value: '2.25rem' } },
      canvasTile: { value: 'auto' },
      // The title bar's height.
      edge: { value: '1.25rem' },
    },
    spacing: { inset: { value: '0.875rem' }, press: { value: '0px' } },
    // Windows didn't animate much: changes are near-instant.
    durations: { fast: { value: '0ms' }, base: { value: '80ms' } },
    easings: {
      standard: { value: 'linear' },
      emphasized: { value: 'linear' },
    },
  },
})
