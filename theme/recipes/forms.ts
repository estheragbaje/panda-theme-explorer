import {
  checkboxAnatomy,
  fieldAnatomy,
  numberInputAnatomy,
  radioGroupAnatomy,
  ratingGroupAnatomy,
  segmentGroupAnatomy,
  sliderAnatomy,
  tagsInputAnatomy,
  toggleAnatomy,
} from '@ark-ui/react/anatomy'
import { defineSlotRecipe } from '@pandacss/dev'
import { colorTransition, controlSurface, disabled, focusRing } from './shared'

// Unselected marks (checkbox box, radio ring, slider thumb ring) use fg.subtle, not a
// border color, so they reach 3:1 against the page (WCAG 1.4.11).
const mark = {
  display: 'grid',
  placeItems: 'center',
  flexShrink: '0',
  w: '4.5',
  h: '4.5',
  bg: 'bg.surface',
  borderWidth: 'focus',
  borderColor: 'fg.subtle',
  color: 'colorPalette.contrast',
  ...colorTransition,
  _hover: { borderColor: 'fg.muted' },
  _focusVisible: focusRing,
  _invalid: { borderColor: 'danger.solid' },
  _checked: { bg: 'colorPalette.solid', borderColor: 'colorPalette.solid' },
} as const

const fieldLabel = { textStyle: 'label', color: 'fg.default' } as const

// The number input's increment and decrement buttons.
const stepTrigger = {
  display: 'grid',
  placeItems: 'center',
  w: 'control.md',
  color: 'fg.muted',
  cursor: 'pointer',
  ...colorTransition,
  _hover: { bg: 'bg.subtle', color: 'fg.default' },
  _disabled: disabled,
  '& svg': { w: '4', h: '4' },
} as const

export const field = defineSlotRecipe({
  className: 'field',
  slots: fieldAnatomy.keys(),
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '1.5', w: 'full' },
    label: { ...fieldLabel, _disabled: { opacity: 'disabled' } },
    requiredIndicator: { color: 'danger.text', ms: '0.5' },
    helperText: { textStyle: 'caption', color: 'fg.muted' },
    errorText: { textStyle: 'caption', color: 'danger.text' },
  },
})

export const checkbox = defineSlotRecipe({
  className: 'checkbox',
  slots: checkboxAnatomy.keys(),
  base: {
    root: {
      colorPalette: 'accent',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2.5',
      cursor: 'pointer',
      _disabled: disabled,
    },
    control: { ...mark, rounded: 'mark', _indeterminate: mark._checked },
    indicator: { '& svg': { w: '3.5', h: '3.5' } },
    label: { textStyle: 'body', userSelect: 'none' },
    group: { display: 'flex', flexDirection: 'column', gap: '2.5' },
  },
})

export const radioGroup = defineSlotRecipe({
  className: 'radio-group',
  slots: radioGroupAnatomy.keys(),
  base: {
    root: {
      colorPalette: 'accent',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5',
      _horizontal: { flexDirection: 'row', flexWrap: 'wrap', gap: '4' },
    },
    label: fieldLabel,
    item: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2.5',
      cursor: 'pointer',
      ...colorTransition,
      _disabled: disabled,
    },
    // Checked: a filled ring with a dot in the middle.
    itemControl: {
      ...mark,
      rounded: 'full',
      _checked: {
        borderColor: 'colorPalette.solid',
        _after: { content: '""', w: '2', h: '2', rounded: 'full', bg: 'colorPalette.solid' },
      },
    },
    itemText: { textStyle: 'body', userSelect: 'none' },
    indicator: { display: 'none' },
  },
  variants: {
    // Selectable cards: the trip page's "pace" picker.
    variant: {
      plain: {},
      card: {
        item: {
          alignItems: 'flex-start',
          p: '4',
          bg: 'bg.card',
          borderWidth: 'card',
          borderColor: 'border.default',
          rounded: 'card',
          _hover: { borderColor: 'border.strong' },
          _checked: { borderColor: 'colorPalette.solid', bg: 'colorPalette.subtle' },
        },
      },
    },
  },
  defaultVariants: { variant: 'plain' },
})

export const segmentGroup = defineSlotRecipe({
  className: 'segment-group',
  slots: segmentGroupAnatomy.keys(),
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      position: 'relative',
      isolation: 'isolate',
      gap: '1',
      p: '1',
      bg: 'bg.subtle',
      rounded: 'control',
      _disabled: disabled,
    },
    label: fieldLabel,
    item: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2',
      h: 'control.sm',
      px: '3.5',
      fontSize: 'sm',
      fontWeight: 'button',
      color: 'fg.muted',
      rounded: 'control',
      cursor: 'pointer',
      userSelect: 'none',
      ...colorTransition,
      _hover: { color: 'fg.default' },
      _checked: { color: 'fg.default' },
      _focusVisible: focusRing,
      _disabled: disabled,
    },
    itemText: { position: 'relative', zIndex: 'raised' },
    itemControl: { display: 'none' },
    // Ark sets --width, --height, --top and --left on the indicator.
    indicator: {
      position: 'absolute',
      zIndex: 'base',
      w: 'var(--width)',
      h: 'var(--height)',
      top: 'var(--top)',
      left: 'var(--left)',
      bg: 'bg.surface',
      rounded: 'control',
      shadow: 'control',
      transitionProperty: 'width, height, left, top',
      transitionDuration: 'fast',
      transitionTimingFunction: 'standard',
    },
  },
})

export const slider = defineSlotRecipe({
  className: 'slider',
  slots: sliderAnatomy.keys(),
  base: {
    root: { colorPalette: 'accent', display: 'flex', flexDirection: 'column', gap: '2', w: 'full', _disabled: disabled },
    label: fieldLabel,
    valueText: { textStyle: 'numeric', fontSize: 'sm', color: 'fg.muted' },
    control: { position: 'relative', display: 'flex', alignItems: 'center', h: '5' },
    track: { flex: '1', h: '1.5', rounded: 'full', bg: 'border.strong', overflow: 'hidden' },
    range: { h: 'full', bg: 'colorPalette.solid' },
    thumb: {
      w: '4.5',
      h: '4.5',
      rounded: 'full',
      bg: 'bg.surface',
      borderWidth: 'focus',
      borderColor: 'colorPalette.solid',
      shadow: 'control',
      cursor: 'grab',
      _dragging: { cursor: 'grabbing' },
      _focusVisible: focusRing,
    },
    markerGroup: { mt: '1' },
    marker: { textStyle: 'caption', color: 'fg.muted' },
    draggingIndicator: { textStyle: 'caption' },
  },
})

export const numberInput = defineSlotRecipe({
  className: 'number-input',
  slots: numberInputAnatomy.keys(),
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '1.5' },
    label: fieldLabel,
    // The border and focus ring sit on the control, which wraps the input and buttons.
    control: {
      ...controlSurface,
      display: 'flex',
      alignItems: 'stretch',
      h: 'control.md',
      overflow: 'hidden',
      _focusVisible: {},
      _focusWithin: focusRing,
    },
    input: {
      flex: '1',
      minW: '0',
      px: '3',
      bg: 'transparent',
      outline: 'none',
      textStyle: 'numeric',
      textAlign: 'center',
    },
    incrementTrigger: stepTrigger,
    decrementTrigger: stepTrigger,
    valueText: { textStyle: 'numeric' },
    scrubber: {},
  },
})

export const ratingGroup = defineSlotRecipe({
  className: 'rating-group',
  slots: ratingGroupAnatomy.keys(),
  base: {
    root: { colorPalette: 'warning', display: 'flex', flexDirection: 'column', gap: '1.5' },
    label: fieldLabel,
    control: { display: 'flex', gap: '0.5' },
    item: {
      color: 'border.strong',
      rounded: 'control',
      cursor: 'pointer',
      '& svg': { w: '4', h: '4', fill: 'currentColor' },
      _highlighted: { color: 'colorPalette.solid' },
      _focusVisible: focusRing,
      _readOnly: { cursor: 'default' },
    },
  },
})

export const toggle = defineSlotRecipe({
  className: 'toggle',
  slots: toggleAnatomy.keys(),
  base: {
    root: {
      colorPalette: 'danger',
      display: 'inline-grid',
      placeItems: 'center',
      w: 'control.md',
      h: 'control.md',
      color: 'fg.muted',
      bg: 'bg.surface',
      borderWidth: 'control',
      borderColor: 'border.strong',
      rounded: 'control',
      cursor: 'pointer',
      ...colorTransition,
      _hover: { bg: 'bg.subtle' },
      _pressed: { color: 'colorPalette.text', bg: 'colorPalette.subtle', borderColor: 'colorPalette.text' },
      _focusVisible: focusRing,
      _disabled: disabled,
      '& svg': { w: '4', h: '4' },
    },
    indicator: { display: 'contents' },
  },
})

export const tagsInput = defineSlotRecipe({
  className: 'tags-input',
  slots: tagsInputAnatomy.keys(),
  base: {
    root: { colorPalette: 'accent', display: 'flex', flexDirection: 'column', gap: '1.5', w: 'full' },
    label: fieldLabel,
    control: {
      ...controlSurface,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '1.5',
      minH: 'control.md',
      px: '2',
      py: '1.5',
      _focusVisible: {},
      _focusWithin: focusRing,
    },
    input: { flex: '1', minW: '20', h: '6', bg: 'transparent', outline: 'none', textStyle: 'body', _placeholder: { color: 'fg.subtle' } },
    itemPreview: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1',
      h: '6',
      ps: '2',
      pe: '1',
      bg: 'colorPalette.subtle',
      color: 'colorPalette.text',
      rounded: 'badge',
      fontSize: 'sm',
      _highlighted: focusRing,
    },
    itemDeleteTrigger: {
      display: 'grid',
      placeItems: 'center',
      w: '4',
      h: '4',
      rounded: 'full',
      cursor: 'pointer',
      _hover: { bg: 'colorPalette.solid/15' },
      '& svg': { w: '3', h: '3' },
    },
    itemInput: { bg: 'transparent', outline: 'none', textStyle: 'body' },
    clearTrigger: { color: 'fg.muted', cursor: 'pointer', '& svg': { w: '4', h: '4' } },
  },
})
