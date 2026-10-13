import { collapsibleAnatomy, splitterAnatomy, tabsAnatomy, tocAnatomy } from '@ark-ui/react/anatomy'
import { defineSlotRecipe } from '@pandacss/dev'
import { colorTransition, disabled, focusRing } from './shared'

export const tabs = defineSlotRecipe({
  className: 'tabs',
  slots: tabsAnatomy.keys(),
  base: {
    root: { colorPalette: 'accent', display: 'flex', flexDirection: 'column', gap: '4', w: 'full' },
    list: {
      position: 'relative',
      isolation: 'isolate',
      display: 'flex',
      gap: '1',
      borderBottomWidth: 'card',
      borderColor: 'border.default',
    },
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2',
      h: 'control.md',
      px: '3',
      textStyle: 'label',
      fontWeight: 'button',
      color: 'fg.muted',
      rounded: 'control',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      ...colorTransition,
      _hover: { color: 'fg.default' },
      _selected: { color: 'fg.default' },
      _focusVisible: focusRing,
      _disabled: disabled,
    },
    // Ark sets --width on the indicator and positions it.
    indicator: {
      bottom: '[-1px]',
      w: 'var(--width)',
      h: '0.5',
      bg: 'colorPalette.solid',
      transitionProperty: 'width, left',
      transitionDuration: 'base',
      transitionTimingFunction: 'emphasized',
    },
    content: { outline: 'none', rounded: 'control', _focusVisible: focusRing },
  },
})

export const collapsible = defineSlotRecipe({
  className: 'collapsible',
  slots: collapsibleAnatomy.keys(),
  base: {
    root: { display: 'flex', flexDirection: 'column' },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2',
      w: 'full',
      textAlign: 'start',
      textStyle: 'label',
      cursor: 'pointer',
      rounded: 'control',
      _focusVisible: focusRing,
    },
    indicator: {
      color: 'fg.muted',
      transitionProperty: 'rotate',
      transitionDuration: 'fast',
      '& svg': { w: '4', h: '4' },
      _open: { rotate: '[180deg]' },
    },
    content: {
      overflow: 'hidden',
      _open: { animationName: 'expandHeight', animationDuration: 'base', animationTimingFunction: 'emphasized' },
      _closed: { animationName: 'collapseHeight', animationDuration: 'fast', animationTimingFunction: 'standard' },
    },
  },
})

// The workbench layout: rail | canvas | inspector.
export const splitter = defineSlotRecipe({
  className: 'splitter',
  slots: splitterAnatomy.keys(),
  base: {
    root: { display: 'flex', h: 'full', minH: '0' },
    panel: {
      // Contains absolutely positioned descendants (Ark's hidden inputs), so they can't
      // stretch the document past the clipped panel.
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minW: '0',
      minH: '0',
      overflow: 'hidden',
      // Ark sizes panels in percent, rounded to 0.1%, so a collapsed sidebar would drift
      // by a few pixels across window sizes. A panel marked data-collapsed is pinned to
      // --panel-collapsed-size exactly; the other panels share what's left.
      '&[data-collapsed]': {
        flex: '0 0 var(--panel-collapsed-size) !important',
        minWidth: 'var(--panel-collapsed-size) !important',
        maxWidth: 'var(--panel-collapsed-size) !important',
      },
    },
    resizeTrigger: {
      position: 'relative',
      flexShrink: '0',
      w: '1.5',
      mx: '[-3px]',
      zIndex: 'raised',
      bg: 'transparent',
      cursor: 'col-resize',
      outline: 'none',
      // The visible 1px line; it turns accent while hovered, dragged or focused.
      _before: {
        content: '""',
        position: 'absolute',
        insetBlock: '0',
        insetInlineStart: '[2.5px]',
        w: '[1px]',
        bg: 'border.default',
        ...colorTransition,
      },
      _hover: { _before: { bg: 'accent.solid' } },
      _dragging: { _before: { bg: 'accent.solid' } },
      _focusVisible: { _before: { bg: 'focusRing', w: '[2px]' } },
      _disabled: { cursor: 'default' },
    },
    resizeTriggerIndicator: { display: 'none' },
  },
})

// The trip page's section nav. Ark marks every heading in view with data-active (not
// :active, so not Panda's _active condition); the page sets data-current on the first
// one only, so a single link is highlighted.
export const toc = defineSlotRecipe({
  className: 'toc',
  slots: tocAnatomy.keys(),
  base: {
    root: {},
    title: { textStyle: 'caption', fontWeight: 'medium', color: 'fg.muted' },
    list: { display: 'flex', gap: '1', overflowX: 'auto', scrollbarWidth: 'none' },
    item: { flexShrink: '0' },
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      h: 'control.sm',
      px: '3',
      rounded: 'control',
      textStyle: 'label',
      color: 'fg.muted',
      whiteSpace: 'nowrap',
      ...colorTransition,
      _hover: { color: 'fg.default', bg: 'bg.subtle' },
      _current: { color: 'accent.text', bg: 'accent.subtle' },
      _focusVisible: focusRing,
    },
    indicator: { display: 'none' },
  },
})
