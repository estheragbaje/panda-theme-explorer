import { defineRecipe } from '@pandacss/dev'
import { controlSurface } from './shared'

export const input = defineRecipe({
  className: 'input',
  base: {
    ...controlSurface,
    w: 'full',
    minW: '0',
    px: '3',
    appearance: 'none',
    textStyle: 'body',
    _placeholder: { color: 'fg.subtle' },
  },
  variants: {
    size: {
      sm: { h: 'control.sm', fontSize: 'sm' },
      md: { h: 'control.md' },
      lg: { h: 'control.lg' },
    },
  },
  defaultVariants: { size: 'md' },
})

export const textarea = defineRecipe({
  className: 'textarea',
  base: {
    ...controlSurface,
    w: 'full',
    minH: '20',
    px: '3',
    py: '2',
    textStyle: 'body',
    resize: 'vertical',
    _placeholder: { color: 'fg.subtle' },
  },
})
