import { defineSlotRecipe } from '@pandacss/dev'

// Decorations come from asset tokens that are 'none' (and sizes that are 0px) in themes
// without them: a strip across the top (assets.edge, sizes.edge tall: Y2K's window title
// bar) and a corner mark (assets.cardMark).
export const card = defineSlotRecipe({
  className: 'card',
  slots: ['root', 'header', 'title', 'description', 'body', 'footer'],
  base: {
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      bg: 'bg.card',
      bgImage: 'cardMark',
      bgRepeat: 'no-repeat',
      bgPosition: '[right 0.875rem bottom 0.75rem]',
      bgSize: '[3.25rem]',
      color: 'fg.default',
      border: 'frame',
      rounded: 'card',
      shadow: 'raised',
      _before: {
        content: '""',
        flexShrink: '0',
        h: 'edge',
        bgImage: 'edge',
        bgRepeat: 'no-repeat',
        bgSize: '[100% 100%]',
        borderTopLeftRadius: 'inherit',
        borderTopRightRadius: 'inherit',
        // Y2K: the title bar sits inside the window's bevel.
        _themeY2k: { m: '[3px 3px 0]' },
      },
    },
    header: { display: 'flex', flexDirection: 'column', gap: '1', p: 'inset', pb: '0' },
    title: { textStyle: 'title' },
    description: { fontSize: 'sm', color: 'fg.muted' },
    body: { display: 'flex', flexDirection: 'column', gap: '3', p: 'inset' },
    footer: { display: 'flex', justifyContent: 'flex-end', gap: '2', p: 'inset', pt: '0' },
  },
})

export const alert = defineSlotRecipe({
  className: 'alert',
  slots: ['root', 'icon', 'content', 'title', 'description'],
  base: {
    root: {
      colorPalette: 'neutral',
      display: 'flex',
      gap: '3',
      p: '4',
      bg: 'colorPalette.subtle',
      color: 'fg.default',
      rounded: 'card',
    },
    icon: { flexShrink: '0', color: 'colorPalette.text', '& svg': { w: '5', h: '5' } },
    content: { display: 'flex', flexDirection: 'column', gap: '1' },
    title: { textStyle: 'label', fontWeight: 'semibold', color: 'colorPalette.text' },
    description: { fontSize: 'sm' },
  },
  variants: {
    status: {
      // Neutral, not accent: in a theme whose accent is green, an accent info alert reads
      // as success.
      info: { root: { colorPalette: 'neutral' } },
      success: { root: { colorPalette: 'success' } },
      warning: { root: { colorPalette: 'warning' } },
      danger: { root: { colorPalette: 'danger' } },
    },
  },
  defaultVariants: { status: 'info' },
})

export const table = defineSlotRecipe({
  className: 'table',
  slots: ['root', 'caption', 'head', 'body', 'row', 'header', 'cell'],
  base: {
    root: { w: 'full', borderCollapse: 'collapse', textStyle: 'body' },
    caption: { captionSide: 'bottom', pt: '3', fontSize: 'sm', color: 'fg.muted', textAlign: 'start' },
    header: {
      px: '3',
      py: '2.5',
      textAlign: 'start',
      textStyle: 'caption',
      fontWeight: 'medium',
      color: 'fg.muted',
      borderBottomWidth: 'card',
      borderColor: 'border.default',
      '&[data-numeric]': { textAlign: 'end' },
    },
    cell: {
      px: '3',
      py: '3',
      fontSize: 'sm',
      borderBottomWidth: 'card',
      borderColor: 'border.default',
      '&[data-numeric]': { textAlign: 'end', textStyle: 'numeric' },
    },
    // A colored marker on the row's first cell: 0px wide except in themes that set
    // borderWidths.rowMarker (F1's team-stripe idea).
    row: {
      '& > :first-child': {
        borderInlineStartWidth: 'rowMarker',
        borderInlineStartColor: 'colorPalette.solid',
      },
    },
  },
})
