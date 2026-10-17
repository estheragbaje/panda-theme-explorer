import { datePickerAnatomy, dialogAnatomy, drawerAnatomy, selectAnatomy, toastAnatomy, tooltipAnatomy } from '@ark-ui/react/anatomy'
import { defineSlotRecipe } from '@pandacss/dev'
import { colorTransition, controlSurface, disabled, focusRing, listItem, overlayContent } from './shared'

const fieldLabel = { textStyle: 'label', color: 'fg.default' } as const

// Small square icon buttons inside overlays (calendar arrows, close buttons).
const iconTrigger = {
  display: 'inline-grid',
  placeItems: 'center',
  w: 'control.sm',
  h: 'control.sm',
  color: 'fg.muted',
  rounded: 'control',
  cursor: 'pointer',
  ...colorTransition,
  _hover: { bg: 'bg.subtle', color: 'fg.default' },
  _focusVisible: focusRing,
  _disabled: disabled,
  '& svg': { w: '4', h: '4' },
} as const

export const select = defineSlotRecipe({
  className: 'select',
  slots: selectAnatomy.keys(),
  base: {
    root: { colorPalette: 'accent', display: 'flex', flexDirection: 'column', gap: '1.5', w: 'full' },
    label: fieldLabel,
    control: { position: 'relative' },
    trigger: {
      ...controlSurface,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2',
      w: 'full',
      h: 'control.md',
      px: '3',
      textStyle: 'body',
      textAlign: 'start',
      cursor: 'pointer',
      _placeholderShown: { color: 'fg.subtle' },
    },
    valueText: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    indicator: {
      color: 'fg.muted',
      '& svg': { w: '4', h: '4' },
      transitionProperty: 'rotate',
      transitionDuration: 'fast',
      _open: { rotate: '[180deg]' },
    },
    clearTrigger: iconTrigger,
    // The list opens in a portal, outside root, so it sets the palette again.
    positioner: { colorPalette: 'accent' },
    content: {
      ...overlayContent,
      p: '1',
      minW: 'var(--reference-width)',
      maxH: 'xs',
      overflowY: 'auto',
      outline: 'none',
    },
    list: {},
    item: { ...listItem, justifyContent: 'space-between', _checked: { color: 'colorPalette.text' } },
    itemText: {},
    itemIndicator: { color: 'colorPalette.text', '& svg': { w: '4', h: '4' } },
    itemGroup: {},
    itemGroupLabel: { px: '2.5', py: '1.5', textStyle: 'caption', fontWeight: 'medium', color: 'fg.muted' },
  },
})

export const datePicker = defineSlotRecipe({
  className: 'date-picker',
  slots: datePickerAnatomy.keys(),
  base: {
    root: { colorPalette: 'accent', display: 'flex', flexDirection: 'column', gap: '1.5', w: 'full' },
    label: fieldLabel,
    control: { display: 'flex', gap: '2' },
    input: { ...controlSurface, flex: '1', minW: '0', h: 'control.md', px: '3', textStyle: 'numeric', fontSize: 'sm' },
    trigger: {
      ...controlSurface,
      display: 'inline-grid',
      placeItems: 'center',
      flexShrink: '0',
      w: 'control.md',
      h: 'control.md',
      color: 'fg.muted',
      cursor: 'pointer',
      _hover: { bg: 'bg.subtle', color: 'fg.default' },
      '& svg': { w: '4', h: '4' },
    },
    clearTrigger: iconTrigger,
    // The calendar opens in a portal, outside root, so it sets the palette again: without
    // it the selected and in-range days have no color.
    positioner: { colorPalette: 'accent' },
    content: { ...overlayContent, display: 'flex', flexDirection: 'column', gap: '3', p: '3' },
    view: { display: 'flex', flexDirection: 'column', gap: '2' },
    viewControl: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2' },
    viewTrigger: { ...iconTrigger, w: 'auto', px: '2', color: 'fg.default', textStyle: 'label' },
    prevTrigger: iconTrigger,
    nextTrigger: iconTrigger,
    rangeText: { textStyle: 'label' },
    table: { w: 'full', borderCollapse: 'collapse' },
    tableHead: {},
    tableBody: {},
    tableRow: {},
    tableHeader: { h: '8', textStyle: 'caption', fontWeight: 'medium', color: 'fg.muted', textAlign: 'center' },
    tableCell: { p: '0', textAlign: 'center' },
    tableCellTrigger: {
      display: 'inline-grid',
      placeItems: 'center',
      w: '9',
      h: '9',
      rounded: 'control',
      textStyle: 'numeric',
      fontSize: 'sm',
      cursor: 'pointer',
      ...colorTransition,
      _hover: { bg: 'bg.subtle' },
      _today: { color: 'colorPalette.text', fontWeight: 'semibold' },
      _selected: { bg: 'colorPalette.solid', color: 'colorPalette.contrast' },
      // A range reads as one strip: days between the ends lose their corners, and the
      // ends lose the corners that face into the range.
      '&[data-in-range]:not([data-selected])': { bg: 'colorPalette.subtle', color: 'colorPalette.text', rounded: 'none' },
      '&[data-range-start]:not([data-range-end])': { roundedRight: 'none' },
      '&[data-range-end]:not([data-range-start])': { roundedLeft: 'none' },
      '&[data-outside-range]': { color: 'fg.subtle' },
      '&[data-unavailable]': { color: 'fg.subtle', textDecoration: 'line-through' },
      _focusVisible: focusRing,
      _disabled: disabled,
    },
    monthSelect: { ...controlSurface, h: 'control.sm', px: '2', fontSize: 'sm' },
    yearSelect: { ...controlSurface, h: 'control.sm', px: '2', fontSize: 'sm' },
    presetTrigger: { ...iconTrigger, w: 'auto', px: '2' },
    valueText: {},
  },
})

export const tooltip = defineSlotRecipe({
  className: 'tooltip',
  slots: tooltipAnatomy.keys(),
  base: {
    trigger: {},
    positioner: {},
    content: {
      // Ark's arrow reads these two variables.
      '--arrow-size': 'sizes.2',
      '--arrow-background': 'colors.bg.inverse',
      px: '2',
      py: '1',
      maxW: 'xs',
      bg: 'bg.inverse',
      color: 'fg.inverse',
      rounded: 'control',
      textStyle: 'caption',
      fontWeight: 'medium',
      shadow: 'overlay',
      zIndex: 'tooltip',
      _open: { animationName: 'fadeIn', animationDuration: 'fast' },
      _closed: { animationName: 'fadeOut', animationDuration: 'fast' },
    },
    arrow: {},
    arrowTip: {},
  },
})

// Bottom sheet. Used for the inspector on mobile.
// A centered dialog with a header (title, description, close) over a body that scrolls.
export const dialog = defineSlotRecipe({
  className: 'dialog',
  slots: dialogAnatomy.keys(),
  base: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 'overlay',
      bg: 'bg.inverse/40',
      _open: { animationName: 'fadeIn', animationDuration: 'base' },
      _closed: { animationName: 'fadeOut', animationDuration: 'fast' },
    },
    positioner: { position: 'fixed', inset: '0', zIndex: 'overlay', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '4' },
    content: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '4',
      // One fixed size (capped only by small screens), so neither switching tabs nor
      // expanding content ever resizes the dialog.
      w: '[min(48rem, 100%)]',
      h: '[min(44rem, 100%)]',
      p: '6',
      bg: 'bg.overlay',
      color: 'fg.default',
      borderWidth: 'card',
      borderColor: 'border.default',
      rounded: 'card',
      shadow: 'overlay',
      outline: 'none',
      _open: { animationName: 'scaleIn', animationDuration: 'base', animationTimingFunction: 'emphasized' },
      _closed: { animationName: 'scaleOut', animationDuration: 'fast', animationTimingFunction: 'standard' },
    },
    title: { textStyle: 'title' },
    description: { fontSize: 'sm', color: 'fg.muted' },
    trigger: {},
    closeTrigger: { ...iconTrigger, position: 'absolute', top: '4', insetEnd: '4' },
  },
})

export const drawer = defineSlotRecipe({
  className: 'drawer',
  slots: drawerAnatomy.keys(),
  base: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 'overlay',
      bg: 'bg.inverse/40',
      _open: { animationName: 'fadeIn', animationDuration: 'base' },
      _closed: { animationName: 'fadeOut', animationDuration: 'fast' },
    },
    positioner: { position: 'fixed', inset: '0', zIndex: 'overlay', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
    content: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      w: 'full',
      maxW: '2xl',
      maxH: '[85svh]',
      px: 'inset',
      pb: 'inset',
      bg: 'bg.overlay',
      color: 'fg.default',
      borderTopWidth: 'card',
      borderColor: 'border.default',
      roundedTop: 'card',
      shadow: 'overlay',
      outline: 'none',
      _open: { animationName: 'slideInBottom', animationDuration: 'base', animationTimingFunction: 'emphasized' },
      _closed: { animationName: 'slideOutBottom', animationDuration: 'fast', animationTimingFunction: 'standard' },
    },
    grabber: { display: 'flex', justifyContent: 'center', py: '3', cursor: 'grab', touchAction: 'none' },
    grabberIndicator: { w: '10', h: '1', rounded: 'full', bg: 'border.strong' },
    title: { textStyle: 'title' },
    description: { fontSize: 'sm', color: 'fg.muted' },
    trigger: {},
    closeTrigger: { ...iconTrigger, position: 'absolute', top: '3', insetEnd: '3' },
    swipeArea: {},
  },
})

export const toast = defineSlotRecipe({
  className: 'toast',
  slots: toastAnatomy.keys(),
  base: {
    group: {},
    // Ark positions and stacks toasts through these variables.
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '1',
      w: 'sm',
      maxW: '[calc(100vw - 2rem)]',
      py: '3.5',
      ps: '4',
      pe: '10',
      layerStyle: 'overlay',
      translate: 'var(--x) var(--y)',
      scale: 'var(--scale)',
      zIndex: 'var(--z-index)',
      h: 'var(--height)',
      opacity: 'var(--opacity)',
      willChange: 'translate, opacity, scale',
      transitionProperty: 'translate, scale, opacity, height',
      transitionDuration: 'base',
      transitionTimingFunction: 'emphasized',
    },
    title: { textStyle: 'label', fontWeight: 'semibold' },
    description: { fontSize: 'sm', color: 'fg.muted' },
    actionTrigger: { ...iconTrigger, w: 'auto', px: '2', mt: '1', color: 'accent.text' },
    closeTrigger: { ...iconTrigger, position: 'absolute', top: '2', insetEnd: '2' },
  },
})

