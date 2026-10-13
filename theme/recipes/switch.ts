import { switchAnatomy } from '@ark-ui/react/anatomy'
import { defineSlotRecipe } from '@pandacss/dev'

// Ark Switch. Slots come from Ark's own anatomy so they stay in sync on upgrades.
// Shape follows radii.badge, so the switch is a pill in Everyday and square in Blueprint.
export const switchRecipe = defineSlotRecipe({
  className: 'switch',
  slots: switchAnatomy.keys(),
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2.5',
      cursor: 'pointer',
      userSelect: 'none',
      _disabled: { opacity: '0.5', cursor: 'not-allowed' },
    },
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: '0',
      p: '0.5',
      rounded: 'badge',
      // fg.subtle, not a border color: the off track must reach 3:1 against the page
      // (WCAG 1.4.11). Everyday: 4.1:1 light, 5.2:1 dark.
      bg: 'fg.subtle',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      transitionTimingFunction: 'standard',
      _checked: { bg: 'accent.solid' },
      _focusVisible: {
        outlineWidth: 'control',
        outlineStyle: 'solid',
        outlineColor: 'focusRing',
        outlineOffset: '0.5',
      },
    },
    thumb: {
      display: 'grid',
      placeItems: 'center',
      rounded: 'badge',
      bg: 'bg.surface',
      color: 'fg.muted',
      shadow: 'control',
      transitionProperty: 'margin-inline-start',
      transitionDuration: 'fast',
      transitionTimingFunction: 'standard',
      _checked: { color: 'accent.text' },
      // An optional icon inside the thumb (the mode switch's sun and moon).
      '& svg': { w: '3', h: '3' },
    },
    label: {
      fontSize: 'sm',
      color: 'fg.muted',
    },
  },
  variants: {
    size: {
      sm: {
        control: { w: '9', h: '5' },
        thumb: { w: '4', h: '4', _checked: { ms: '4' } },
      },
      // Room for an icon in the thumb.
      md: {
        control: { w: '11', h: '6' },
        thumb: { w: '5', h: '5', _checked: { ms: '5' } },
      },
    },
  },
  defaultVariants: { size: 'sm' },
})
