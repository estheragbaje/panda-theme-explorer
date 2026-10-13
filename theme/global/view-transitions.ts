import { defineKeyframes, defineViewTransitions } from '@pandacss/dev'

// Mode switch: the new mode is revealed in a circle growing from the switch.
// The switch sets --reveal-x, --reveal-y and --reveal-r on <html> before starting.
export const keyframes = defineKeyframes({
  modeReveal: {
    from: { clipPath: 'circle(0px at var(--reveal-x) var(--reveal-y))' },
    to: { clipPath: 'circle(var(--reveal-r) at var(--reveal-x) var(--reveal-y))' },
  },
})

export const viewTransitions = defineViewTransitions({
  mode: {
    old: { animation: 'none', mixBlendMode: 'normal' },
    new: { animation: 'modeReveal 400ms cubic-bezier(0.2, 0, 0, 1)', mixBlendMode: 'normal' },
  },
})
