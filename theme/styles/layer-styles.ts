import { defineLayerStyles } from '@pandacss/dev'

// Surfaces, by role. Themes change what each one looks like through the contract.
// Layer styles take full CSS property names (backgroundColor, not bg).

export const layerStyles = defineLayerStyles({
  // The page background, including the theme's canvas texture (ruled paper, grid, dots).
  // backgroundAttachment local: on a scroll container the texture moves with the
  // content, like paper, instead of staying fixed behind it.
  canvas: {
    value: {
      backgroundColor: 'bg.canvas',
      backgroundImage: 'canvas',
      backgroundSize: '{sizes.canvasTile}',
      backgroundAttachment: 'local',
      color: 'fg.default',
    },
  },
  surface: {
    value: { backgroundColor: 'bg.surface', border: 'frame', borderRadius: 'card' },
  },
  raised: {
    value: { backgroundColor: 'bg.card', border: 'frame', borderRadius: 'card', boxShadow: 'raised' },
  },
  // Popovers, menus, toasts.
  overlay: {
    value: { backgroundColor: 'bg.overlay', border: 'frame', borderRadius: 'card', boxShadow: 'overlay' },
  },
  // Bars pinned over scrolling content, such as the trip page's section nav.
  sticky: {
    value: { backgroundColor: 'bg.sticky' },
  },
  inset: {
    value: { backgroundColor: 'bg.subtle', borderRadius: 'control' },
  },
})
