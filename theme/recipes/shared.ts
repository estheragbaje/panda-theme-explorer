// Style fragments shared by recipes, so focus, controls and overlays behave the same
// everywhere. Every value is a contract token.

export const focusRing = {
  outlineWidth: 'focus',
  outlineStyle: 'solid',
  outlineColor: 'focusRing',
  outlineOffset: '0.5',
} as const

export const colorTransition = {
  transitionProperty: 'background-color, border-color, color, box-shadow, translate, rotate, scale',
  transitionDuration: 'fast',
  transitionTimingFunction: 'standard',
} as const

export const disabled = {
  opacity: 'disabled',
  cursor: 'not-allowed',
} as const

// Text inputs, select triggers, number inputs, date inputs, tags inputs.
export const controlSurface = {
  bg: 'bg.surface',
  color: 'fg.default',
  borderWidth: 'control',
  borderColor: 'border.default',
  rounded: 'control',
  // Sunken in themes that shade fields (Y2K); 'none' elsewhere.
  shadow: 'field',
  ...colorTransition,
  _hover: { borderColor: 'border.strong' },
  _focusVisible: focusRing,
  _invalid: { borderColor: 'danger.solid' },
  _disabled: disabled,
} as const

// Popover-like content: select lists, date picker, tooltips' bigger cousins.
export const overlayContent = {
  layerStyle: 'overlay',
  zIndex: 'popover',
  _open: { animationName: 'scaleIn', animationDuration: 'fast', animationTimingFunction: 'standard' },
  _closed: { animationName: 'scaleOut', animationDuration: 'fast', animationTimingFunction: 'standard' },
} as const

// Rows in lists and menus.
export const listItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  px: '2.5',
  py: '1.5',
  rounded: 'control',
  cursor: 'pointer',
  textStyle: 'body',
  _highlighted: { bg: 'bg.subtle' },
  _disabled: disabled,
} as const
