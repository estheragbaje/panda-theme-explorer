import { defineKeyframes } from '@pandacss/dev'

// Enter and exit motion for overlays. Ark's Presence waits for the exit animation,
// so every *In keyframe has a matching *Out.
export const motionKeyframes = defineKeyframes({
  fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
  fadeOut: { from: { opacity: '1' }, to: { opacity: '0' } },
  scaleIn: { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
  scaleOut: { from: { opacity: '1', transform: 'scale(1)' }, to: { opacity: '0', transform: 'scale(0.96)' } },
  // Ark Drawer sets --drawer-translate-x/y while it is being swiped.
  slideInBottom: {
    from: { transform: 'translate3d(0, 100%, 0)' },
    to: { transform: 'translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0)' },
  },
  slideOutBottom: {
    from: { transform: 'translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0)' },
    to: { transform: 'translate3d(0, 100%, 0)' },
  },
  // Ark Collapsible exposes the measured height as --height.
  expandHeight: { from: { height: '0' }, to: { height: 'var(--height)' } },
  collapseHeight: { from: { height: 'var(--height)' }, to: { height: '0' } },
})
