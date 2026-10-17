import { defineRecipe } from '@pandacss/dev'
import { colorTransition, disabled, focusRing } from './shared'

// Y2K (Windows 98/2000) draws solid, outline and tonal buttons alike: raised grey that
// sinks when pressed (a budgeted theme condition).
const classicButton = {
  bg: 'bg.surface',
  color: 'fg.default',
  borderColor: 'transparent',
  shadow: 'control',
  _hover: { bg: 'bg.surface' },
  _active: { shadow: 'pressed' },
} as const

// Four roles, as on formula1.com: solid (primary), outline (secondary), tonal, ghost.
// solid and tonal follow colorPalette (accent by default).
export const button = defineRecipe({
  className: 'button',
  base: {
    colorPalette: 'accent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    flexShrink: '0',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    cursor: 'pointer',
    fontFamily: 'body',
    fontWeight: 'button',
    letterSpacing: 'button',
    rounded: 'control',
    borderWidth: 'control',
    borderColor: 'transparent',
    ...colorTransition,
    // Riso presses into its shadow (spacing.press); other themes don't move.
    _active: { pressOffset: 'press' },
    // Sketch's hand-drawn buttons tilt slightly under the pointer (a budgeted theme condition).
    _themeSketch: { _hover: { rotate: '[-0.6deg]' } },
    _focusVisible: focusRing,
    _disabled: disabled,
    '& svg': { w: '4', h: '4', flexShrink: '0' },
  },
  variants: {
    variant: {
      solid: {
        bg: 'colorPalette.solid',
        color: 'colorPalette.contrast',
        shadow: 'control',
        _hover: { bg: 'colorPalette.solid/90' },
        _active: { shadow: 'pressed' },
        // Y2K: every Windows button is the same raised grey; the page's default action
        // also gets the black border Windows drew around the default button.
        _themeY2k: { ...classicButton, '&[data-default]': { outline: '1px solid', outlineColor: 'fg.default', outlineOffset: '0' } },
      },
      outline: {
        bg: 'bg.surface',
        color: 'fg.default',
        borderColor: 'border.strong',
        _hover: { bg: 'bg.subtle' },
        _themeY2k: classicButton,
      },
      tonal: {
        bg: 'colorPalette.subtle',
        color: 'colorPalette.text',
        _hover: { bg: 'colorPalette.subtle/70' },
        _themeY2k: classicButton,
      },
      ghost: {
        bg: 'transparent',
        color: 'fg.default',
        _hover: { bg: 'bg.subtle' },
      },
    },
    size: {
      sm: { h: 'control.sm', px: '3', fontSize: 'sm' },
      md: { h: 'control.md', px: '4', fontSize: 'sm' },
      lg: { h: 'control.lg', px: '5', fontSize: 'md' },
    },
    // Square, icon-only buttons. Always pass an aria-label.
    iconOnly: {
      true: {},
    },
  },
  // A compound variant, so it overrides the size's horizontal padding. As a plain variant
  // it lost to the size class in the stylesheet, and icon buttons came out wider than tall.
  compoundVariants: [{ iconOnly: true, css: { px: '0', aspectRatio: 'square' } }],
  defaultVariants: { variant: 'solid', size: 'md' },
})
