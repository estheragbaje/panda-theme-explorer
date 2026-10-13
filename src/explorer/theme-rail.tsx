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

const swatch = css({ w: '3', h: '3', rounded: 'full', borderWidth: 'card', borderColor: 'border.strong' })

// Each item is wrapped in its own theme, so the row is a small live specimen.
const item = css({
  position: 'relative',
  w: 'full',
  bg: 'bg.canvas',
  color: 'fg.default',
  borderWidth: 'card',
  borderColor: 'border.default',
  rounded: 'card',
  cursor: 'pointer',
  _hover: { borderColor: 'border.strong' },
  _checked: { borderColor: 'accent.solid', outlineWidth: 'card', outlineStyle: 'solid', outlineColor: 'accent.solid' },
  '&:has(:focus-visible)': { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5' },
})

export function ThemeRail({ theme, onThemeChange, collapsed, onToggleCollapsed }: {
  theme: ThemeId
  onThemeChange: (id: ThemeId) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}) {
  return (
    <nav aria-label="Themes" className={css({ display: 'flex', flexDirection: 'column', h: 'full', bg: 'bg.surface', overflow: 'hidden' })}>
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: '2', h: '12', px: '3', flexShrink: '0' })}>
        {!collapsed && <span className={css({ textStyle: 'label' })}>Themes</span>}
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand themes ([)' : 'Collapse themes ([)'}
          aria-expanded={!collapsed}
          aria-controls="theme-rail-list"
          title={collapsed ? 'Expand themes ([)' : 'Collapse themes ([)'}
        >
          {collapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
        </Button>
      </div>
      {/* aria-controls needs a stable id; Ark replaces the id given to RadioGroup.Root. */}
      <div id="theme-rail-list" className={css({ display: 'contents' })}>
      <RadioGroup.Root
        value={theme}
        onValueChange={(d) => d.value && onThemeChange(d.value as ThemeId)}
        aria-label="Theme"
        className={css({ flex: '1', minH: '0', overflowY: 'auto', overscrollBehavior: 'contain', px: collapsed ? '1.5' : '3', pb: '3', gap: '2' })}
      >
        {THEMES.map((t, index) => {
          const row = (
            <RadioGroup.Item
              value={t.id}
              data-panda-theme={t.id}
              className={cx(
                item,
                css(
                  collapsed
                    ? { flexDirection: 'column', gap: '1', p: '1.5', alignItems: 'center' }
                    : { gap: '3', p: '2.5', alignItems: 'center' },
                ),
              )}
            >
              <span aria-hidden className={tile}>
                {t.monogram}
              </span>
              <RadioGroup.ItemText className={css(collapsed ? { fontSize: '2xs', maxW: 'full', truncate: true } : { display: 'grid', gap: '0.5', minW: '0' })}>
                {collapsed ? (
                  t.label
                ) : (
                  <>
                    <span className={css({ fontFamily: 'display', fontWeight: 'display', letterSpacing: 'display' })}>{t.label}</span>
                    <span className={css({ fontSize: 'xs', color: 'fg.muted' })}>{t.note}</span>
                  </>
                )}
              </RadioGroup.ItemText>
              {!collapsed && (
                <span aria-hidden className={css({ display: 'flex', gap: '1', ms: 'auto' })}>
                  <span className={swatch} style={{ background: 'var(--colors-bg-canvas)' }} />
                  <span className={swatch} style={{ background: 'var(--colors-accent-solid)' }} />
                  <span className={swatch} style={{ background: 'var(--colors-fg-default)' }} />
                </span>
              )}
              <RadioGroup.ItemControl className={css({ srOnly: true })} />
              <RadioGroup.ItemHiddenInput />
              {/* Keyboard hint for 1–9, shown only in the expanded rail. */}
              {!collapsed && index < 9 && (
                <kbd aria-hidden className={css({ position: 'absolute', top: '1', insetEnd: '1.5', fontSize: '2xs', color: 'fg.subtle', fontFamily: 'mono' })}>
                  {index + 1}
                </kbd>
              )}
            </RadioGroup.Item>
          )
          return collapsed ? (
            <Tooltip.Root key={t.id} positioning={{ placement: 'right' }} openDelay={150} closeDelay={0}>
              <Tooltip.Trigger asChild>{row}</Tooltip.Trigger>
              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content>
                    <Tooltip.Arrow>
                      <Tooltip.ArrowTip />
                    </Tooltip.Arrow>
                    {t.label}, {t.note}
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Portal>
            </Tooltip.Root>
          ) : (
            <div key={t.id}>{row}</div>
          )
        })}
      </RadioGroup.Root>
      </div>
    </nav>
  )
}
