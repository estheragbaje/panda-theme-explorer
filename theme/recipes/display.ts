import { avatarAnatomy, progressAnatomy } from '@ark-ui/react/anatomy'
import { defineSlotRecipe } from '@pandacss/dev'

export const progress = defineSlotRecipe({
  className: 'progress',
  slots: progressAnatomy.keys(),
  base: {
    root: { colorPalette: 'accent', display: 'flex', flexDirection: 'column', gap: '1.5', w: 'full' },
    label: { textStyle: 'label' },
    valueText: { textStyle: 'numeric', fontSize: 'sm', color: 'fg.muted' },
    track: { h: '2', rounded: 'full', bg: 'bg.subtle', overflow: 'hidden' },
    range: {
      h: 'full',
      bg: 'colorPalette.solid',
      rounded: 'full',
      transitionProperty: 'width',
      transitionDuration: 'base',
      transitionTimingFunction: 'emphasized',
    },
    // Ark sizes the circle from --size and --thickness.
    circle: { '--size': 'sizes.12', '--thickness': 'sizes.1' },
    circleTrack: { stroke: 'bg.subtle' },
    circleRange: {
      stroke: 'colorPalette.solid',
      strokeLinecap: 'round',
      transitionProperty: 'stroke-dashoffset',
      transitionDuration: 'base',
      transitionTimingFunction: 'emphasized',
    },
    view: {},
  },
})

export const avatar = defineSlotRecipe({
  className: 'avatar',
  slots: avatarAnatomy.keys(),
  base: {
    root: {
      colorPalette: 'neutral',
      position: 'relative',
      display: 'inline-flex',
      flexShrink: '0',
      overflow: 'hidden',
      rounded: 'full',
      bg: 'colorPalette.subtle',
      color: 'colorPalette.text',
      fontWeight: 'semibold',
      userSelect: 'none',
      // Separates overlapping avatars in a group.
      outlineWidth: 'focus',
      outlineStyle: 'solid',
      outlineColor: 'bg.canvas',
    },
    image: { w: 'full', h: 'full', objectFit: 'cover' },
    fallback: { display: 'grid', placeItems: 'center', w: 'full', h: 'full' },
  },
  variants: {
    size: {
      sm: { root: { w: '7', h: '7', fontSize: '2xs' } },
      md: { root: { w: '9', h: '9', fontSize: 'xs' } },
      lg: { root: { w: '12', h: '12', fontSize: 'sm' } },
    },
  },
  defaultVariants: { size: 'md' },
})
