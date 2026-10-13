import { defineLayerStyles } from '@pandacss/dev'

// Surfaces, by role. Themes change what each one looks like through the contract.
// Layer styles take full CSS property names (backgroundColor, not bg).
const border = { borderWidth: 'card', borderStyle: 'solid', borderColor: 'border.default' } as const

export const layerStyles = defineLayerStyles({
  // The page background, including the theme's canvas texture (ruled paper, grid, dots).
  // backgroundAttachment local: on a scroll container the texture moves with the
  // content, like paper, instead of staying fixed behind it.
  canvas: {
    value: {
      backgroundColor: 'bg.canvas',
      backgroundImage: 'canvas',
      backgroundSize: 'canvasTile',
      backgroundAttachment: 'local',
      color: 'fg.default',
    },
  },
  surface: {
    value: { backgroundColor: 'bg.surface', ...border, borderRadius: 'card' },
  },
  raised: {
    value: { backgroundColor: 'bg.card', ...border, borderRadius: 'card', boxShadow: 'raised' },
  },
  // Popovers, menus, toasts.
  overlay: {
    value: { backgroundColor: 'bg.overlay', ...border, borderRadius: 'card', boxShadow: 'overlay' },
  },
  inset: {
    value: { backgroundColor: 'bg.subtle', borderRadius: 'control' },
  },
})
