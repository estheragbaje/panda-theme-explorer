'use client'

import { Clipboard } from '@ark-ui/react/clipboard'
import { useHotkeys } from '@ark-ui/react/hotkeys'
import { Portal } from '@ark-ui/react/portal'
import { useSplitter } from '@ark-ui/react/splitter'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { LuCheck, LuCopy, LuPanelRightClose, LuPanelRightOpen } from 'react-icons/lu'
import { css } from '../../styled-system/css'
import { button } from '../../styled-system/recipes'
import { THEMES, type ThemeId } from '../../theme/registry'
import { TripPage } from '../trip/trip-page'
import * as Drawer from '../ui/drawer'
import * as RadioGroup from '../ui/radio-group'
import * as Splitter from '../ui/splitter'
import { Toaster, toaster } from '../ui/toast'
import { Inspector } from './inspector'
import { toggleMode, useIsDark } from './mode'
import { ModeSwitch } from './mode-switch'
import { setTheme, useTheme } from './theme-choice'
import { ThemeRail } from './theme-rail'
import { themeSource } from './theme-tokens'

// The trip page doesn't depend on layout state, so dragging a panel doesn't re-render it.
const Canvas = memo(TripPage)

// Panel sizes are kept in pixels and converted to the splitter's percentages for the
// current width, so the collapsed rail stays 72px whatever the window size.
type Layout = { railPx: number; railCollapsed: boolean; inspectorPx: number; inspectorOpen: boolean }
const DEFAULT_LAYOUT: Layout = { railPx: 248, railCollapsed: false, inspectorPx: 320, inspectorOpen: false }
const RAIL_COLLAPSED = 72
const RAIL_MIN = 200
const RAIL_MAX = 320
const INSPECTOR_MIN = 260
const INSPECTOR_MAX = 440
const CANVAS_MIN = 320
const LAYOUT_KEY = 'pt-layout'
const SSR_WIDTH = 1280 // assumed until the real width is measured after hydration

const NARROW_QUERY = '(max-width: 47.9975rem)'
const isNarrow = () => matchMedia(NARROW_QUERY).matches
const subscribeNarrow = (onChange: () => void) => {
  const mql = matchMedia(NARROW_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

const toPct = (px: number, width: number) => (px / Math.max(width, 1)) * 100

// Splitter percentages for a layout at a given width.
function sizesFor(l: Layout, width: number) {
  const rail = toPct(l.railCollapsed ? RAIL_COLLAPSED : l.railPx, width)
  const inspector = l.inspectorOpen ? toPct(l.inspectorPx, width) : 0
  return [rail, 100 - rail - inspector, inspector]
}

function readLayout(): Layout {
  try {
    const stored = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? 'null')
    if (stored && typeof stored.railPx === 'number') return { ...DEFAULT_LAYOUT, ...stored }
  } catch {}
  return DEFAULT_LAYOUT
}

function Header({ theme, inspectorOpen, onToggleInspector }: { theme: ThemeId; inspectorOpen: boolean; onToggleInspector: () => void }) {
  return (
    <header
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '3',
        h: '14',
        px: { base: '3', md: '4' },
        flexShrink: '0',
        bg: 'bg.surface',
        borderBottomWidth: 'card',
        borderColor: 'border.default',
      })}
    >
      <div className={css({ display: 'flex', alignItems: 'baseline', gap: '2', minW: '0' })}>
        <span className={css({ fontFamily: 'display', fontWeight: 'display', letterSpacing: 'display', fontSize: 'md', whiteSpace: 'nowrap' })}>Panda Themes</span>
        <span className={css({ fontSize: 'sm', color: 'fg.muted', truncate: true, hideBelow: 'sm' })}>
          {THEMES.find((t) => t.id === theme)?.label}
        </span>
      </div>
      <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
        <button
          type="button"
          onClick={onToggleInspector}
          aria-expanded={inspectorOpen}
          // The inspector is only rendered while open, so only point at it then.
          aria-controls={inspectorOpen ? 'inspector' : undefined}
          title="Inspector (])"
          aria-label="Inspector"
          className={button({ variant: inspectorOpen ? 'tonal' : 'outline', size: 'sm' })}
        >
          {inspectorOpen ? <LuPanelRightClose /> : <LuPanelRightOpen />}
          {/* Icon-only on phones, so the header fits the widest theme faces (Pixel). */}
          <span className={css({ hideBelow: 'sm' })}>Inspector</span>
        </button>
        <Clipboard.Root
          value={themeSource(theme)}
          onStatusChange={(d) => d.copied && toaster.create({ title: 'Theme copied', description: `${theme}.ts source, ready to paste` })}
        >
          <Clipboard.Trigger className={button({ variant: 'outline', size: 'sm' })} aria-label="Copy theme source">
            <Clipboard.Indicator copied={<LuCheck />}>
              <LuCopy />
            </Clipboard.Indicator>
            <span className={css({ hideBelow: 'md' })}>Copy theme</span>
          </Clipboard.Trigger>
        </Clipboard.Root>
        <ModeSwitch />
      </div>
    </header>
  )
}

// Phones: a horizontal theme picker under the header instead of the rail.
function ThemeStrip({ theme }: { theme: ThemeId }) {
  return (
    <RadioGroup.Root
      value={theme}
      onValueChange={(d) => d.value && setTheme(d.value as ThemeId)}
      orientation="horizontal"
      aria-label="Theme"
      className={css({ hideFrom: 'md', flexWrap: 'nowrap', overflowX: 'auto', gap: '2', px: '3', py: '2', bg: 'bg.surface', borderBottomWidth: 'card', borderColor: 'border.default', scrollbarWidth: 'none' })}
    >
      {THEMES.map((t) => (
        <RadioGroup.Item
          key={t.id}
          value={t.id}
          data-panda-theme={t.id}
          className={css({
            flexShrink: '0',
            gap: '2',
            px: '3',
            h: 'control.md',
            bg: 'bg.canvas',
            color: 'fg.default',
            borderWidth: 'card',
            borderColor: 'border.default',
            rounded: 'control',
            _checked: { borderColor: 'accent.solid', outlineWidth: 'card', outlineStyle: 'solid', outlineColor: 'accent.solid' },
            '&:has(:focus-visible)': { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5' },
          })}
        >
          <RadioGroup.ItemText className={css({ fontFamily: 'display', fontWeight: 'display', fontSize: 'sm' })}>{t.label}</RadioGroup.ItemText>
          <RadioGroup.ItemControl className={css({ srOnly: true })} />
          <RadioGroup.ItemHiddenInput />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}

export function Explorer() {
  const theme = useTheme()
  const isDark = useIsDark()
  const rootRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(SSR_WIDTH)
  const [measured, setMeasured] = useState(false)
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT)
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Below md the inspector is a drawer, so the header button reflects the drawer there.
  const narrow = useSyncExternalStore(subscribeNarrow, isNarrow, () => false)
  const restored = useRef(false)
  const widthRef = useRef(SSR_WIDTH)
  // Refs mirror state for callbacks and effects; render reads the state itself.
  const layoutRef = useRef(layout)
  // True while we push sizes ourselves (toggles, restore, window resizes). Ark reports
  // transient sizes then, validated against stale constraints (a collapsed rail at the
  // old width's collapsed size), so only drags and keyboard resizes are read back.
  const pushing = useRef(false)
  const holdResizeEvents = useCallback(() => {
    pushing.current = true
    requestAnimationFrame(() => requestAnimationFrame(() => (pushing.current = false)))
  }, [])

  const pct = (px: number) => toPct(px, width)

  // The splitter is uncontrolled: layout changes are pushed with setSizes, and onResize
  // (drags, keyboard resizes, collapses) is read back into the pixel layout.
  const splitter = useSplitter({
    panels: [
      { id: 'rail', collapsible: true, collapsedSize: pct(RAIL_COLLAPSED), minSize: pct(RAIL_MIN), maxSize: pct(RAIL_MAX) },
      { id: 'canvas', minSize: pct(CANVAS_MIN) },
      { id: 'inspector', collapsible: true, collapsedSize: 0, minSize: pct(INSPECTOR_MIN), maxSize: pct(INSPECTOR_MAX) },
    ],
    // Ark falls back to defaultSize when the panel constraints change (every resize), so
    // it must describe the current layout, not the first-visit one.
    defaultSize: sizesFor(layout, width),
    onResize: ({ size }) => {
      // Below md the panels are hidden and Ark squeezes them to fit; that must not be
      // saved as the user's layout.
      if (isNarrow() || pushing.current) return
      const railPx = (size[0] / 100) * widthRef.current
      const inspectorPx = (size[2] / 100) * widthRef.current
      setLayout((current) => ({
        railCollapsed: railPx <= RAIL_COLLAPSED + 2,
        railPx: railPx > RAIL_COLLAPSED + 2 ? Math.round(railPx) : current.railPx,
        inspectorOpen: inspectorPx >= 1,
        inspectorPx: inspectorPx >= 1 ? Math.round(inspectorPx) : current.inspectorPx,
      }))
    },
  })
  const splitterRef = useRef(splitter)
  useLayoutEffect(() => {
    splitterRef.current = splitter
    layoutRef.current = layout
  })

  const apply = useCallback((next: Layout) => {
    layoutRef.current = next
    setLayout(next)
    holdResizeEvents()
    splitterRef.current.setSizes(sizesFor(next, widthRef.current))
  }, [holdResizeEvents])

  // Measure the width, then keep measuring on resize.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    widthRef.current = el.offsetWidth
    setWidth(el.offsetWidth)
    holdResizeEvents()
    setMeasured(true)
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (Math.abs(w - widthRef.current) < 0.5) return
      holdResizeEvents()
      widthRef.current = w
      setWidth(w)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [holdResizeEvents])

  // Once the panel constraints (in percent) have re-rendered for the measured width,
  // restore the stored layout, and after every later resize re-apply it. Applying sizes
  // before that re-render lets Ark validate them against the old width's constraints:
  // it expands a collapsed rail, or saves the old collapsed size as the rail's width.
  useLayoutEffect(() => {
    if (!measured || isNarrow()) return
    if (restored.current) {
      holdResizeEvents()
      splitterRef.current.setSizes(sizesFor(layoutRef.current, width))
      return
    }
    restored.current = true
    apply(readLayout())
  }, [measured, width, apply, holdResizeEvents])

  // Persist every change after the stored layout has been restored.
  useEffect(() => {
    if (!restored.current) return
    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout))
    } catch {}
  }, [layout])

  const toggleRail = useCallback(() => apply({ ...layoutRef.current, railCollapsed: !layoutRef.current.railCollapsed }), [apply])
  const toggleInspector = useCallback(() => {
    if (isNarrow()) setDrawerOpen((open) => !open)
    else apply({ ...layoutRef.current, inspectorOpen: !layoutRef.current.inspectorOpen })
  }, [apply])
  const closeInspector = useCallback(() => apply({ ...layoutRef.current, inspectorOpen: false }), [apply])

  // Single-key shortcuts; Ark keeps them quiet while an input has focus.
  useHotkeys({
    commands: [
      { hotkey: 'd', label: 'Toggle dark mode', action: () => toggleMode(document.querySelector('[data-mode-switch] [data-part=control]')) },
      { hotkey: '[', label: 'Toggle theme rail', action: toggleRail },
      { hotkey: ']', label: 'Toggle inspector', action: toggleInspector },
      ...THEMES.slice(0, 9).map((t, i) => ({ hotkey: String(i + 1), label: `Switch to ${t.label}`, action: () => setTheme(t.id) })),
    ],
  })

  return (
    // One screen: only the panels scroll, never the document.
    <div className={css({ display: 'flex', flexDirection: 'column', h: '[100dvh]', overflow: 'hidden' })}>
      <Header theme={theme} inspectorOpen={narrow ? drawerOpen : layout.inspectorOpen} onToggleInspector={toggleInspector} />
      <ThemeStrip theme={theme} />
      <Splitter.RootProvider ref={rootRef} value={splitter} className={css({ flex: '1', minH: '0' })}>
        <Splitter.Panel
          id="rail"
          data-collapsed={layout.railCollapsed ? '' : undefined}
          style={{ '--panel-collapsed-size': `${RAIL_COLLAPSED}px` } as CSSProperties}
          className={css({ hideBelow: 'md', borderEndWidth: 'card', borderColor: 'border.default' })}
        >
          <ThemeRail theme={theme} onThemeChange={setTheme} collapsed={layout.railCollapsed} onToggleCollapsed={toggleRail} />
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="rail:canvas" aria-label="Resize theme rail" className={css({ hideBelow: 'md' })} />
        <Splitter.Panel id="canvas">
          {/* The main landmark: screen-reader users jump straight to the trip page. */}
          <main className={css({ flex: '1', minH: '0' })}>
            <Canvas />
          </main>
        </Splitter.Panel>
        <Splitter.ResizeTrigger
          id="canvas:inspector"
          aria-label="Resize inspector"
          disabled={!layout.inspectorOpen}
          className={css({ hideBelow: 'md', _disabled: { display: 'none' } })}
        />
        <Splitter.Panel
          id="inspector"
          // No border while closed, or the 0-width panel still shows a 1px line.
          className={css({ hideBelow: 'md', borderColor: 'border.default', '&:has(#inspector)': { borderStartWidth: 'card' } })}
        >
          {layout.inspectorOpen && <Inspector theme={theme} isDark={isDark} onClose={closeInspector} />}
        </Splitter.Panel>
      </Splitter.RootProvider>

      {/* Phones: the inspector as a bottom sheet. */}
      <Drawer.Root open={drawerOpen} onOpenChange={(d) => setDrawerOpen(d.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content className={css({ h: '[80svh]', px: '0', pb: '0' })}>
              <Drawer.Grabber>
                <Drawer.GrabberIndicator />
              </Drawer.Grabber>
              <Drawer.Title className={css({ srOnly: true })}>Inspector</Drawer.Title>
              {drawerOpen && <Inspector theme={theme} isDark={isDark} onClose={() => setDrawerOpen(false)} />}
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <Toaster />
    </div>
  )
}
