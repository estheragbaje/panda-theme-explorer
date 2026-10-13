import { defineRecipe } from '@pandacss/dev'
import { colorTransition, disabled, focusRing } from './shared'

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
    // Panda's soft controls squish on press (a budgeted theme condition).
    _themePanda: { _active: { scale: '[0.97]' } },
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
      },
      outline: {
        bg: 'bg.surface',
        color: 'fg.default',
        borderColor: 'border.strong',
        _hover: { bg: 'bg.subtle' },
      },
      tonal: {
        bg: 'colorPalette.subtle',
        color: 'colorPalette.text',
        _hover: { bg: 'colorPalette.subtle/70' },
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
      true: { px: '0', aspectRatio: 'square' },
    },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
})
