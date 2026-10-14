'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import { LuCheck, LuSearch, LuX } from 'react-icons/lu'
import { css } from '../../styled-system/css'
import { input } from '../../styled-system/recipes'
import { DEFAULT_THEME, THEMES, type ThemeId } from '../../theme/registry'
import * as Checkbox from '../ui/checkbox'
import { Button } from '../ui/primitives'
import { toaster } from '../ui/toast'
import { differsFromBaseline, GROUP_ORDER, themeTokens, type TokenRow } from './theme-tokens'

// A visual sample for each kind of token, drawn from the live CSS variable.
function Sample({ row }: { row: TokenRow }) {
  const v = `var(${row.cssVar})`
  const box = css({ w: '7', h: '7', flexShrink: '0', display: 'grid', placeItems: 'center', rounded: 'control', fontSize: 'xs' })
  const styles: Record<string, CSSProperties> = {
    colors: { background: v, boxShadow: 'inset 0 0 0 1px var(--colors-border-strong)' },
    fonts: { fontFamily: v },
    fontSizes: {},
    fontWeights: { fontWeight: v },
    letterSpacings: { letterSpacing: v },
    radii: { borderRadius: v, border: '2px solid var(--colors-fg-muted)', borderRightColor: 'transparent', borderBottomColor: 'transparent' },
    borderWidths: { borderTop: `${v} solid var(--colors-fg-muted)`, borderRadius: 0, height: '0.75rem' },
    shadows: { boxShadow: v, background: 'var(--colors-bg-surface)' },
    assets: { backgroundImage: v, backgroundColor: 'var(--colors-bg-subtle)', backgroundSize: 'var(--sizes-canvas-tile)' },
  }
  const text = ['fonts', 'fontSizes', 'fontWeights', 'letterSpacings'].includes(row.category) ? 'Aa' : ''
  return (
    <span aria-hidden className={box} style={styles[row.category] ?? { background: 'var(--colors-bg-subtle)' }}>
      {text}
    </span>
  )
}

export function Inspector({ theme, isDark, onClose }: { theme: ThemeId; isDark: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [onlyDiff, setOnlyDiff] = useState(false)
  const rows = useMemo(() => themeTokens(theme), [theme])
  const changed = useMemo(() => differsFromBaseline(theme), [theme])
  const label = THEMES.find((t) => t.id === theme)?.label ?? theme
  const isBaseline = theme === DEFAULT_THEME

  const q = query.trim().toLowerCase()
  const visible = rows.filter(
    (r) =>
      (!onlyDiff || changed.has(r.path)) &&
      (!q || r.path.toLowerCase().includes(q) || r.cssVar.includes(q) || r.light.toLowerCase().includes(q) || r.dark.toLowerCase().includes(q)),
  )

  async function copy(row: TokenRow, raw: boolean) {
    const text = raw ? (isDark ? row.dark : row.light) : `var(${row.cssVar})`
    try {
      await navigator.clipboard.writeText(text)
      toaster.create({ title: 'Copied', description: text })
    } catch {
      toaster.create({ title: 'Copy failed', description: 'Your browser blocked clipboard access.' })
    }
  }

  return (
    <aside id="inspector" aria-label="Inspector" className={css({ display: 'flex', flexDirection: 'column', h: 'full', minW: '64', minH: '0', bg: 'bg.surface' })}>
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2', h: '12', ps: '4', pe: '2', flexShrink: '0' })}>
        <div className={css({ minW: '0' })}>
          <p className={css({ textStyle: 'label' })}>Inspector</p>
        </div>
        <Button variant="ghost" size="sm" iconOnly onClick={onClose} aria-label="Close inspector (])" title="Close inspector (])">
          <LuX />
        </Button>
      </div>
      <div className={css({ display: 'grid', gap: '3', px: '4', pb: '3', flexShrink: '0', borderBottomWidth: 'card', borderColor: 'border.default' })}>
        <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
          {label}, {isDark ? 'dark' : 'light'} mode. {rows.length} tokens. Click a row to copy its variable; Alt-click copies the value.
        </p>
        <label className={css({ position: 'relative', display: 'block' })}>
          <span className={css({ srOnly: true })}>Filter tokens</span>
          <LuSearch aria-hidden className={css({ position: 'absolute', insetStart: '2.5', top: '[50%]', translate: '[0 -50%]', w: '4', h: '4', color: 'fg.subtle' })} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name or value"
            className={`${input({ size: 'sm' })} ${css({ ps: '8' })}`}
          />
        </label>
        <Checkbox.Root checked={onlyDiff} onCheckedChange={(d) => setOnlyDiff(d.checked === true)}>
          <Checkbox.Control>
            <Checkbox.Indicator>
              <LuCheck />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label className={css({ fontSize: 'sm' })}>Only what differs from Everyday</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </div>

      {/* minH 0: a flex child otherwise grows to its content and never scrolls. */}
      <div className={css({ flex: '1', minH: '0', overflowY: 'auto', overscrollBehavior: 'contain', px: '2', py: '2' })}>
        {onlyDiff && isBaseline ? (
          <p className={css({ p: '4', fontSize: 'sm', color: 'fg.muted' })}>Everyday is the baseline, so nothing differs from it.</p>
        ) : visible.length === 0 ? (
          <p className={css({ p: '4', fontSize: 'sm', color: 'fg.muted' })}>No tokens match “{query}”.</p>
        ) : (
          GROUP_ORDER.map((group) => {
            const groupRows = visible.filter((r) => r.group === group)
            if (groupRows.length === 0) return null
            return (
              <section key={group} aria-label={group} className={css({ pb: '3' })}>
                <h3 className={css({ px: '2', py: '1.5', textStyle: 'caption', fontWeight: 'semibold', color: 'fg.muted', textTransform: 'uppercase', letterSpacing: 'wider' })}>
                  {group}
                </h3>
                <ul>
                  {groupRows.map((row) => (
                    <li key={row.path}>
                      <button
                        type="button"
                        onClick={(e) => copy(row, e.altKey)}
                        title={`Copy var(${row.cssVar})`}
                        className={css({
                          display: 'grid',
                          gridTemplateColumns: '[auto minmax(0, 1fr)]',
                          alignItems: 'center',
                          gap: '2.5',
                          w: 'full',
                          px: '2',
                          py: '1.5',
                          rounded: 'control',
                          textAlign: 'start',
                          cursor: 'copy',
                          _hover: { bg: 'bg.subtle' },
                          _focusVisible: { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '[-2px]' },
                        })}
                      >
                        <Sample row={row} />
                        <span className={css({ display: 'grid', minW: '0' })}>
                          <span className={css({ fontSize: 'sm', fontWeight: 'medium', truncate: true })}>{row.name}</span>
                          <span className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'fg.muted', truncate: true })}>
                            {isDark ? row.dark : row.light}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })
        )}
      </div>
    </aside>
  )
}
