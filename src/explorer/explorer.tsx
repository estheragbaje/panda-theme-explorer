'use client'

import { useHotkeys } from '@ark-ui/react/hotkeys'
import { Portal } from '@ark-ui/react/portal'
import { useSplitter } from '@ark-ui/react/splitter'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { LuGithub, LuPanelRightClose, LuPanelRightOpen } from 'react-icons/lu'
import { css, cx } from '../../styled-system/css'
import { button } from '../../styled-system/recipes'
import { THEMES, type ThemeId } from '../../theme/registry'
import { TripPage } from '../trip/trip-page'
import * as Drawer from '../ui/drawer'
import * as RadioGroup from '../ui/radio-group'
import * as Splitter from '../ui/splitter'
import { Toaster } from '../ui/toast'
import { Inspector } from './inspector'
import { toggleMode, useIsDark } from './mode'
import { ModeSwitch } from './mode-switch'
import { PandaLogo } from './panda-logo'
import { setTheme, useTheme } from './theme-choice'
import { ThemeRail } from './theme-rail'
import { ThemeExport } from './theme-export'

// The trip page doesn't depend on layout state, so dragging a panel doesn't re-render it.
const Canvas = memo(TripPage)

// Panel sizes are kept in pixels and converted to the splitter's percentages for the
// current width, so the collapsed rail stays 72px whatever the window size.
type Layout = { railPx: number; railCollapsed: boolean; inspectorPx: number; inspectorOpen: boolean }
const DEFAULT_LAYOUT: Layout = { railPx: 248, railCollapsed: false, inspectorPx: 320, inspectorOpen: false }
const RAIL_COLLAPSED = 80
const RAIL_MIN = 200
const RAIL_MAX = 320
const INSPECTOR_MIN = 260
const INSPECTOR_MAX = 440
const CANVAS_MIN = 320
// Panel open/close animation; matches the splitter recipe's [data-animating] transition.
const PANEL_MS = 240
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

// The resize handles are 16px gutters (the inspector's only while it's open). Ark shares
// out what's left after them, so pixel sizes convert against that space, not the width.
const GUTTER = 16
const panelSpace = (width: number, inspectorOpen: boolean) => width - GUTTER - (inspectorOpen ? GUTTER : 0)

// Splitter percentages for a layout at a given width.
function sizesFor(l: Layout, width: number) {
  const space = panelSpace(width, l.inspectorOpen)
  const rail = toPct(l.railCollapsed ? RAIL_COLLAPSED : l.railPx, space)
  const inspector = l.inspectorOpen ? toPct(l.inspectorPx, space) : 0
  return [rail, 100 - rail - inspector, inspector]
}

function readLayout(): Layout {
  try {
    const stored = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? 'null')
    if (stored && typeof stored.railPx === 'number') return { ...DEFAULT_LAYOUT, ...stored }
  } catch {}
  return DEFAULT_LAYOUT
}

// The explorer's own chrome (header, rail, inspector) always wears Everyday, so the tool
// stays still while the preview changes. CHROME marks those parts; the preview canvas
// inherits the chosen theme from <html>, which the head script sets before first paint.
const CHROME = { 'data-panda-theme': 'everyday' } as const

// Chrome actions in Panda Studio's style: compact 36px buttons, a black primary (the
// export split button) and white outlined secondaries with a hairline border.
const secondaryAction = (pressed: boolean) =>
  cx(button({ variant: 'outline', size: 'md' }), css({ px: '3.5', borderColor: 'border.default', bg: pressed ? 'bg.subtle' : 'bg.surface', _hover: { bg: 'bg.subtle' } }))

// Resize handles are the gutters between the floating panels: invisible until hovered,
// focused or dragged, when a short grip appears.
const gutter = css({
  hideBelow: 'md',
  w: '4',
  mx: '0',
  _before: { insetBlock: '[calc(50% - 1.5rem)]', insetInlineStart: '[calc(50% - 1.5px)]', w: '[3px]', rounded: 'full', bg: 'transparent' },
  _hover: { _before: { bg: 'border.strong' } },
  _dragging: { _before: { bg: 'fg.muted' } },
  _focusVisible: { _before: { bg: 'focusRing', w: '[3px]' } },
})

// Floating panels: rounded cards on the backdrop, separated by the gutters.
const panelCard = css({ h: 'full', bg: 'bg.surface', borderWidth: 'card', borderColor: 'border.default', rounded: '[1.25rem]', overflow: 'hidden' })

// What the site is built on, in the header nav and the footer.
const SITE_LINKS = [
  { label: 'Panda CSS', href: 'https://panda-css.com' },
  { label: 'Ark UI', href: 'https://ark-ui.com' },
  { label: 'Park UI', href: 'https://park-ui.com' },
]

// External links open in a new tab, announced to screen readers.
const newTab = { target: '_blank', rel: 'noopener noreferrer' } as const
const NewTabHint = () => <span className={css({ srOnly: true })}> (opens in a new tab)</span>

const REPO_LINKS = [
  { label: 'Panda CSS', href: 'https://github.com/chakra-ui/panda' },
  { label: 'Ark UI', href: 'https://github.com/chakra-ui/ark' },
]

const navLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  h: '9',
  px: '3',
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'fg.muted',
  rounded: 'full',
  transitionProperty: 'color',
  transitionDuration: '[150ms]',
  _hover: { color: 'fg.default' },
  _focusVisible: { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5' },
})

function Header({ theme, inspectorOpen, onToggleInspector }: { theme: ThemeId; inspectorOpen: boolean; onToggleInspector: () => void }) {
  return (
    <header
      {...CHROME}
      className={css({
        // Three columns, so the links sit at the true center whatever the sides hold.
        display: 'grid',
        gridTemplateColumns: { base: '[auto 1fr]', lg: '[1fr auto 1fr]' },
        alignItems: 'center',
        gap: '3',
        py: { base: '3', md: '5' },
        px: { base: '4', md: '5' },
        flexShrink: '0',
        color: 'fg.default',
      })}
    >
      <PandaLogo />
      <nav aria-label="Site" className={css({ hideBelow: 'lg' })}>
        <ul className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
          {SITE_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} {...newTab} className={navLink}>
                {link.label}
                <NewTabHint />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2' })}>
        <button
          type="button"
          onClick={onToggleInspector}
          aria-expanded={inspectorOpen}
          // The inspector is only rendered while open, so only point at it then.
          aria-controls={inspectorOpen ? 'inspector' : undefined}
          title="Inspector (])"
          aria-label="Inspector"
          className={secondaryAction(inspectorOpen)}
        >
          {inspectorOpen ? <LuPanelRightClose /> : <LuPanelRightOpen />}
          {/* Icon-only on phones, so the header fits the widest theme faces (Pixel). */}
          <span className={css({ hideBelow: 'sm' })}>Inspector</span>
        </button>
        <ThemeExport theme={theme} />
        <ModeSwitch />
      </div>
    </header>
  )
}

// A slim footer under the panels, in the header's quiet style.

const footerLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  h: '6',
  gap: '1.5',
  color: 'fg.muted',
  rounded: 'mark',
  transitionProperty: 'color',
  transitionDuration: '[150ms]',
  _hover: { color: 'fg.default' },
  _focusVisible: { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5' },
})

function Footer() {
  return (
    <footer
      {...CHROME}
      className={css({
        hideBelow: 'md',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6',
        px: '6',
        pt: '16',
        pb: '6',
        flexShrink: '0',
        fontSize: 'sm',
        color: 'fg.muted',
      })}
    >
      <p>
        <span className={css({ color: 'fg.default', fontWeight: 'medium' })}>Panda Themes</span>
        <span aria-hidden className={css({ mx: '2.5', color: 'fg.subtle' })}>|</span>
        Made with Panda CSS &amp; Ark UI
      </p>
      <nav aria-label="Footer" className={css({ display: 'flex', alignItems: 'center', gap: '6' })}>
        <ul className={css({ display: 'flex', alignItems: 'center', gap: '6' })}>
          {SITE_LINKS.map((link) => (
            <li key={link.label}>
              <a className={footerLink} href={link.href} {...newTab}>
                {link.label}
                <NewTabHint />
              </a>
            </li>
          ))}
        </ul>
        <span aria-hidden className={css({ w: '[1px]', h: '4', bg: 'border.default' })} />
        <ul aria-label="Source on GitHub" className={css({ display: 'flex', alignItems: 'center', gap: '6' })}>
          {REPO_LINKS.map((link) => (
            <li key={link.label}>
              <a className={cx(footerLink, css({ '& svg': { w: '4', h: '4' } }))} href={link.href} {...newTab} aria-label={`${link.label} on GitHub (opens in a new tab)`}>
                <LuGithub aria-hidden />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
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
      {...CHROME}
      className={css({ hideFrom: 'md', flexWrap: 'nowrap', overflowX: 'auto', gap: '2', px: '4', pb: '3', scrollbarWidth: 'none', '--chrome-ring': '{colors.fg.default}' })}
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
            _checked: { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'var(--chrome-ring)', outlineOffset: '0.5' },
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
  // True while a toggle animates the panels. Drags and window resizes stay instant.
  const [animating, setAnimating] = useState(false)
  // While a toggle animates, the trip page is laid out once at its final width (the panel
  // edge reveals or covers it) instead of re-laying out at every intermediate width.
  const [frozenCanvas, setFrozenCanvas] = useState<number | null>(null)
  const animationTimer = useRef<number | undefined>(undefined)
  // Below md the inspector is a drawer, so the header button reflects the drawer there.
  const narrow = useSyncExternalStore(subscribeNarrow, isNarrow, () => false)
  const restored = useRef(false)
  const widthRef = useRef(SSR_WIDTH)
  // Refs mirror state for callbacks and effects; render reads the state itself.
  const layoutRef = useRef(layout)
  // Only the user's own resizes (a drag, or arrow keys on a focused handle) are read back
  // into the layout. When we push sizes ourselves (toggles, restore, window resizes) Ark
  // reports transient sizes validated against stale constraints, such as a collapsed rail
  // at the old width's collapsed size; those must never be saved. `pushing` also covers
  // the frames right after a push, in case a handle happens to have focus then.
  const pushing = useRef(false)
  const holdResizeEvents = useCallback(() => {
    pushing.current = true
    requestAnimationFrame(() => requestAnimationFrame(() => (pushing.current = false)))
  }, [])

  const pct = (px: number) => toPct(px, panelSpace(width, layout.inspectorOpen))

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
    onResize: ({ size, resizeTriggerId }) => {
      // Below md the panels are hidden and Ark squeezes them to fit; that must not be
      // saved as the user's layout.
      const byUser = resizeTriggerId != null || !!document.activeElement?.closest('[data-scope=splitter][data-part=resize-trigger]')
      if (isNarrow() || pushing.current || !byUser) return
      const space = panelSpace(widthRef.current, size[2] > 0)
      const railPx = (size[0] / 100) * space
      const inspectorPx = (size[2] / 100) * space
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

  // Toggles animate: the panels ease to their new widths. The rail keeps its full layout
  // while it narrows and switches to the compact one when the animation ends, and the
  // inspector stays mounted until it has closed, so nothing reflows mid-animation.
  const animateTo = useCallback(
    (next: Layout) => {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const space = panelSpace(widthRef.current, next.inspectorOpen)
        const rail = next.railCollapsed ? RAIL_COLLAPSED : next.railPx
        setFrozenCanvas(Math.round(space - rail - (next.inspectorOpen ? next.inspectorPx : 0)))
        setAnimating(true)
        window.clearTimeout(animationTimer.current)
        animationTimer.current = window.setTimeout(() => {
          setAnimating(false)
          setFrozenCanvas(null)
        }, PANEL_MS + 60)
      }
      apply(next)
    },
    [apply],
  )
  useEffect(() => () => window.clearTimeout(animationTimer.current), [])

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

  const toggleRail = useCallback(() => animateTo({ ...layoutRef.current, railCollapsed: !layoutRef.current.railCollapsed }), [animateTo])
  const toggleInspector = useCallback(() => {
    if (isNarrow()) setDrawerOpen((open) => !open)
    else animateTo({ ...layoutRef.current, inspectorOpen: !layoutRef.current.inspectorOpen })
  }, [animateTo])
  const closeInspector = useCallback(() => animateTo({ ...layoutRef.current, inspectorOpen: false }), [animateTo])
  const railCompact = layout.railCollapsed && !animating

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
    // One screen: only the panels scroll, never the document. clip, not hidden, so focus or
    // scrollIntoView can't scroll the shell itself and shift every panel.
    <div className={css({ position: 'relative', isolation: 'isolate', display: 'flex', flexDirection: 'column', h: '[100dvh]', overflow: 'clip' })}>
      {/* The backdrop the panels float on, in the chrome's colors. */}
      <div aria-hidden {...CHROME} className={css({ position: 'absolute', inset: '0', zIndex: 'behind', bg: 'bg.surface' })} />
      <Header theme={theme} inspectorOpen={narrow ? drawerOpen : layout.inspectorOpen} onToggleInspector={toggleInspector} />
      <ThemeStrip theme={theme} />
      {/* The gutters sit outside the splitter, so its measured width is the panels' width. */}
      <div className={css({ display: 'flex', flex: '1', minH: '0', px: { base: '0', md: '4' } })}>
      <Splitter.RootProvider ref={rootRef} value={splitter} data-animating={animating ? '' : undefined}
        // Ark makes the root overflow: hidden, which focus or scrollIntoView could scroll,
        // shifting every panel. Visible: it isn't a scroll container, and the preview's
        // shadow isn't cut off; each panel still clips its own content.
        className={css({ flex: '1', minW: '0', minH: '0', overflow: 'visible !important' })}
      >
        <Splitter.Panel
          id="rail"
          {...CHROME}
          data-collapsed={layout.railCollapsed ? '' : undefined}
          style={{ '--panel-collapsed-size': `${RAIL_COLLAPSED}px` } as CSSProperties}
          className={css({ hideBelow: 'md' })}
        >
          <ThemeRail theme={theme} onThemeChange={setTheme} collapsed={railCompact} onToggleCollapsed={toggleRail} />
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="rail:canvas" aria-label="Resize theme rail" {...CHROME} className={gutter} />
        {/* Overflow visible, so the preview's shadow can fall into the gutters (Ark sets
            overflow: hidden on every panel). */}
        <Splitter.Panel id="canvas" className={css({ overflow: 'visible !important' })}>
          {/* The main landmark: screen-reader users jump straight to the trip page. The
              preview is framed like a page on a desk; it takes the chosen theme. */}
          <main
            className={css({
              flex: '1',
              minH: '0',
              // clip, not hidden: a hidden box can still be scrolled by focus or by
              // scrollIntoView, which slid the whole frame up inside its panel.
              overflow: 'clip',
              bg: 'bg.canvas',
              rounded: { base: 'none', md: '[1.25rem]' },
              // A thin neutral border and a soft shadow, in the chrome's terms rather than the
              // theme's, so the frame reads the same around every theme.
              boxShadow: {
                base: 'none',
                md: '[0 0 0 1px rgba(17, 24, 39, 0.09), 0 1px 2px rgba(17, 24, 39, 0.05), 0 12px 32px -12px rgba(17, 24, 39, 0.16)]',
              },
              _dark: {
                boxShadow: { base: 'none', md: '[0 0 0 1px rgba(255, 255, 255, 0.09), 0 12px 32px -12px rgba(0, 0, 0, 0.6)]' },
              },
            })}
          >
            <div className={css({ h: 'full' })} style={frozenCanvas === null ? undefined : { width: frozenCanvas }}>
              <Canvas />
            </div>
          </main>
        </Splitter.Panel>
        <Splitter.ResizeTrigger
          id="canvas:inspector"
          aria-label="Resize inspector"
          disabled={!layout.inspectorOpen}
          {...CHROME}
          className={cx(gutter, css({ _disabled: { display: 'none' } }))}
        />
        <Splitter.Panel id="inspector" {...CHROME} className={css({ hideBelow: 'md' })}>
          {(layout.inspectorOpen || animating) && (
            <div className={panelCard}>
              <Inspector theme={theme} isDark={isDark} onClose={closeInspector} />
            </div>
          )}
        </Splitter.Panel>
      </Splitter.RootProvider>
      </div>
      <Footer />

      {/* Phones: the inspector as a bottom sheet. */}
      <Drawer.Root open={drawerOpen} onOpenChange={(d) => setDrawerOpen(d.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content {...CHROME} className={css({ h: '[80svh]', px: '0', pb: '0' })}>
              <Drawer.Grabber>
                <Drawer.GrabberIndicator />
              </Drawer.Grabber>
              <Drawer.Title className={css({ srOnly: true })}>Inspector</Drawer.Title>
              {drawerOpen && <Inspector theme={theme} isDark={isDark} onClose={() => setDrawerOpen(false)} />}
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <Toaster theme="everyday" />
    </div>
  )
}
