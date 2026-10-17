'use client'

import { Portal } from '@ark-ui/react/portal'
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu'
import { css, cx } from '../../styled-system/css'
import { THEMES, type ThemeId } from '../../theme/registry'
import { Button } from '../ui/primitives'
import * as RadioGroup from '../ui/radio-group'
import * as Tooltip from '../ui/tooltip'

// The monogram tile: styled only from contract tokens, so each theme draws its own.
const tile = css({
  display: 'grid',
  placeItems: 'center',
  flexShrink: '0',
  w: '9',
  h: '9',
  bg: 'accent.solid',
  color: 'accent.contrast',
  fontFamily: 'display',
  fontWeight: 'display',
  letterSpacing: 'display',
  fontSize: 'sm',
  rounded: 'control',
  borderWidth: 'control',
  borderColor: 'border.strong',
  shadow: 'control',
})

// The theme's palette as one strip: page, card, accent tint, accent, ink.
const paletteStyles = {
  gridColumn: '1 / -1',
  alignSelf: 'end',
  display: 'flex',
  h: '2.5',
  rounded: 'badge',
  overflow: 'hidden',
  borderWidth: 'card',
  borderColor: 'border.default',
  '& > span': { flex: '[1 1 0]', minW: '0', transitionProperty: 'flex-grow', transitionDuration: '[180ms]' },
} as const

// Collapsed: the strip sits in the monogram's column, centered under it at the same width,
// and only the two signature colors (the accent and its tint) keep any width. The tint,
// not the highlight: in some dark palettes the highlight equals the accent. Merged into one
// css() call: as separate classes, the two grid-column rules would tie on specificity.
const palette = (collapsed: boolean) =>
  css(paletteStyles, collapsed ? { gridColumn: '1', '& > span:not([data-key])': { flexGrow: '0' } } : {})

// Each tile wears its own theme, so it's a small live specimen. One layout serves both
// rail states: the monogram stays put at the left, and as the rail narrows the name and
// the wide palette are covered rather than rearranged, so collapsing never snaps. Tiles
// share the rail's height in both states; below 3.5rem each the list scrolls instead.
const item = css({
  position: 'relative',
  flex: '1',
  minH: '14',
  w: 'full',
  display: 'grid',
  gridTemplateColumns: '[2.25rem minmax(0, 1fr)]',
  gridTemplateRows: '[auto 1fr auto]',
  rowGap: '2',
  p: '2.5',
  alignItems: 'center',
  overflow: 'hidden',
  bg: 'bg.canvas',
  color: 'fg.default',
  borderWidth: 'card',
  borderColor: 'border.default',
  rounded: 'card',
  cursor: 'pointer',
  transitionProperty: 'border-color, outline-color',
  transitionDuration: '[150ms]',
  _hover: { borderColor: 'border.strong' },
  // The selection ring is the chrome's ink (--chrome-ring, set on the rail), not the
  // tile's own accent, so it reads the same on every theme.
  outlineWidth: 'focus',
  outlineStyle: 'solid',
  outlineColor: 'transparent',
  outlineOffset: '0.5',
  _checked: { outlineColor: 'var(--chrome-ring)' },
  '&:has(:focus-visible)': { outlineColor: 'focusRing' },
  // Before hydration the radio group only knows the default theme. Until the explorer has
  // measured, the ring follows the theme the head script put on <html> instead, so it
  // doesn't jump from Everyday to the stored theme on reload.
  '[data-premeasure] [data-part=item]&': { outlineColor: 'transparent' },
  'html:not([data-panda-theme]) [data-premeasure] [data-panda-theme=everyday]&': { outlineColor: 'var(--chrome-ring)' },
  'html[data-panda-theme=everyday] [data-premeasure] [data-panda-theme=everyday]&': { outlineColor: 'var(--chrome-ring)' },
  'html[data-panda-theme=riso] [data-premeasure] [data-panda-theme=riso]&': { outlineColor: 'var(--chrome-ring)' },
  'html[data-panda-theme=pixel] [data-premeasure] [data-panda-theme=pixel]&': { outlineColor: 'var(--chrome-ring)' },
  'html[data-panda-theme=panda] [data-premeasure] [data-panda-theme=panda]&': { outlineColor: 'var(--chrome-ring)' },
  'html[data-panda-theme=blueprint] [data-premeasure] [data-panda-theme=blueprint]&': { outlineColor: 'var(--chrome-ring)' },
  'html[data-panda-theme=sketch] [data-premeasure] [data-panda-theme=sketch]&': { outlineColor: 'var(--chrome-ring)' },
})

// Text that belongs to one rail state fades instead of appearing or moving.
const fade = (visible: boolean) => css({ opacity: visible ? '[1]' : '[0]', transitionProperty: 'opacity', transitionDuration: '[180ms]' })

export function ThemeRail({ theme, onThemeChange, collapsed, onToggleCollapsed }: {
  theme: ThemeId
  onThemeChange: (id: ThemeId) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}) {
  return (
    <nav
      aria-label="Themes"
      className={css({
        display: 'flex',
        flexDirection: 'column',
        h: 'full',
        bg: 'bg.surface',
        borderWidth: 'card',
        borderColor: 'border.default',
        rounded: '[1.25rem]',
        overflow: 'hidden',
        '--chrome-ring': '{colors.fg.default}',
        // A reload with the rail stored collapsed: until the explorer has measured and
        // restored the layout, the head script's data-layout-rail shows the compact state,
        // so the first paint matches it.
        '[data-layout-rail=collapsed] [data-premeasure] &': {
          '& [data-rail-part=expanded]': { opacity: '[0]' },
          '& [data-rail-part=compact]': { opacity: '[1]' },
          '& [data-rail-part=palette]': { gridColumn: '1', '& > span:not([data-key])': { flexGrow: '0' } },
          '& [data-shows=expanded]': { display: 'none' },
          '& [data-shows=collapsed]': { display: 'block' },
        },
      })}
    >
      {/* The button is pinned to the right edge with a gutter that centers it at the
          collapsed width, so it doesn't move when the rail collapses. */}
      <div className={css({ display: 'flex', alignItems: 'center', h: '9', ps: '[22px]', pe: '[23px]', mt: '3', mb: '3', flexShrink: '0' })}>
        <h2 aria-hidden={collapsed} data-rail-part="expanded" className={cx(fade(!collapsed), css({ flex: '1', minW: '0', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: 'xl', fontWeight: 'semibold', letterSpacing: 'tight' }))}>
          Themes
        </h2>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand themes' : 'Collapse themes ([)'}
          aria-expanded={!collapsed}
          aria-controls="theme-rail-list"
          title={collapsed ? 'Expand themes ([)' : 'Collapse themes ([)'}
          className={css({ flexShrink: '0' })}
        >
          {/* Both icons are rendered, so first-paint CSS can show the stored state's. */}
          <LuPanelLeftClose data-shows="expanded" className={css({ display: collapsed ? 'none' : 'block' })} />
          <LuPanelLeftOpen data-shows="collapsed" className={css({ display: collapsed ? 'block' : 'none' })} />
        </Button>
      </div>
      {/* aria-controls needs a stable id; Ark replaces the id given to RadioGroup.Root. */}
      <div id="theme-rail-list" className={css({ display: 'contents' })}>
        <RadioGroup.Root
          value={theme}
          onValueChange={(d) => d.value && onThemeChange(d.value as ThemeId)}
          aria-label="Theme"
          className={css({ flex: '1', minH: '0', overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain', px: '2.5', pt: '1', pb: '2.5', gap: '2.5', '& > div': { display: 'flex', flex: '1', minH: '14' } })}
        >
          {THEMES.map((t) => (
            // The same elements in both states (the tooltip is only disabled), so tiles are
            // never remounted when the rail collapses. The wrapper is the tooltip trigger:
            // as the tile itself, the tooltip's data-state would replace the radio's.
            <Tooltip.Root key={t.id} disabled={!collapsed} positioning={{ placement: 'right' }} openDelay={150} closeDelay={0}>
              <Tooltip.Trigger asChild>
                <div>
                    <RadioGroup.Item value={t.id} data-panda-theme={t.id} className={item}>
                      <span aria-hidden className={tile}>
                        {t.monogram}
                      </span>
                      <RadioGroup.ItemText data-rail-part="expanded" className={cx(fade(!collapsed), css({ minW: '0', ms: '3', truncate: true, fontFamily: 'display', fontWeight: 'display', letterSpacing: 'display' }))}>
                        {t.label}
                      </RadioGroup.ItemText>
                      {/* The name under the monogram, shown once the rail is collapsed. */}
                      <span aria-hidden data-rail-part="compact" className={cx(fade(collapsed), css({ gridColumn: '1', alignSelf: 'start', w: '[2.25rem]', textAlign: 'center', fontSize: '[0.625rem]', lineHeight: 'tight', whiteSpace: 'nowrap', overflow: 'visible', justifySelf: 'center' }))}>
                        {t.label}
                      </span>
                      <span aria-hidden data-rail-part="palette" className={palette(collapsed)}>
                        <span className={css({ bg: 'bg.canvas' })} />
                        <span className={css({ bg: 'bg.card' })} />
                        <span data-key className={css({ bg: 'accent.subtle' })} />
                        <span data-key className={css({ bg: 'accent.solid' })} />
                        <span className={css({ bg: 'fg.default' })} />
                      </span>
                      <RadioGroup.ItemControl className={css({ srOnly: true })} />
                      <RadioGroup.ItemHiddenInput />
                    </RadioGroup.Item>
                </div>
              </Tooltip.Trigger>
              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content>
                    <Tooltip.Arrow>
                      <Tooltip.ArrowTip />
                    </Tooltip.Arrow>
                    {t.label}
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Portal>
            </Tooltip.Root>
          ))}
        </RadioGroup.Root>
      </div>
    </nav>
  )
}
