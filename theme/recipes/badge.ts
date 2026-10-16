import { defineRecipe } from '@pandacss/dev'

export const badge = defineRecipe({
  className: 'badge',
  base: {
    colorPalette: 'neutral',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1',
    px: '2',
    h: '5',
    rounded: 'badge',
    textStyle: 'caption',
    fontFamily: 'badge',
    fontWeight: 'medium',
    whiteSpace: 'nowrap',
    '& svg': { w: '3', h: '3' },
  },
  variants: {
    variant: {
      subtle: { bg: 'colorPalette.subtle', color: 'colorPalette.text' },
      solid: { bg: 'colorPalette.solid', color: 'colorPalette.contrast' },
      outline: { borderWidth: 'control', borderColor: 'colorPalette.text', color: 'colorPalette.text' },
    },
  },
  defaultVariants: { variant: 'subtle' },
})

export const kbd = defineRecipe({
  className: 'kbd',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minW: '5',
    h: '5',
    px: '1.5',
    fontFamily: 'mono',
    fontSize: 'xs',
    color: 'fg.muted',
    bg: 'bg.subtle',
    borderWidth: 'control',
    borderColor: 'border.default',
    rounded: 'control',
  },
})
