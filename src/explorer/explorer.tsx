'use client'

import { useHotkeys } from '@ark-ui/react/hotkeys'
import { Portal } from '@ark-ui/react/portal'
import { useSplitter } from '@ark-ui/react/splitter'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { LuPanelRightClose, LuPanelRightOpen } from 'react-icons/lu'
import { css, cx } from '../../styled-system/css'
import { button } from '../../styled-system/recipes'
import { LAYOUT_STORAGE_KEY, PANEL_SIZES, THEMES, type ThemeId } from '../../theme/registry'
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
import { UseTheme } from './use-theme'

// The trip page doesn't depend on layout state, so dragging a panel doesn't re-render it.
const Canvas = memo(TripPage)

// Panel sizes are kept in pixels and converted to the splitter's percentages for the
// current width, so the collapsed rail stays 72px whatever the window size.
type Layout = { railPx: number; railCollapsed: boolean; inspectorPx: number; inspectorOpen: boolean }
const DEFAULT_LAYOUT: Layout = { railPx: PANEL_SIZES.rail.default, railCollapsed: false, inspectorPx: PANEL_SIZES.inspector.default, inspectorOpen: false }
const RAIL_COLLAPSED = PANEL_SIZES.rail.collapsed
const RAIL_MIN = PANEL_SIZES.rail.min
const RAIL_MAX = PANEL_SIZES.rail.max
const INSPECTOR_MIN = PANEL_SIZES.inspector.min
const INSPECTOR_MAX = PANEL_SIZES.inspector.max
const CANVAS_MIN = 320
// Panel open/close animation; matches the splitter recipe's [data-animating] transition.
const PANEL_MS = 240
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
const GUTTER = PANEL_SIZES.gutter
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
    const stored = JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY) ?? 'null')
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

// A reload with the inspector stored open: until the explorer has measured and restored
// the layout, the head script's data-layout-inspector shows the button pressed, with its
// close icon, so the first paint matches.
const inspectorButtonPremeasure = css({
  '[data-layout-inspector=open] [data-premeasure] &': {
    bg: 'bg.subtle',
    '& [data-shows=open]': { display: 'block' },
    '& [data-shows=closed]': { display: 'none' },
  },
})

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

// Before the explorer has measured the window, the rail and inspector take their stored
// pixel sizes from the head script's variables (see the splitter recipe), so a reload
// paints the panels where they'll stay.
const railPremeasure = { '--premeasure-size': `var(--layout-rail, ${PANEL_SIZES.rail.default}px)` }
const inspectorPremeasure = { '--premeasure-size': 'var(--layout-inspector, 0px)' } as CSSProperties
// The inspector's gutter is hidden while it's closed; a stored open inspector needs it
// from the first paint too.
const inspectorGutter = cx(
  gutter,
  css({ _disabled: { display: 'none' }, '[data-layout-inspector=open] [data-premeasure] > &': { md: { display: 'block !important' } } }),
)

// External links open in a new tab, announced to screen readers.
const newTab = { target: '_blank', rel: 'noopener noreferrer' } as const
const NewTabHint = () => <span className={css({ srOnly: true })}> (opens in a new tab)</span>

// The selected theme, centered in the header: its monogram tile, drawn in the theme itself
// like the rail's tiles, and its name. From lg up only: narrower headers can't center it
// beside the actions, and there the rail (or the phone strip) shows the selection.
function ActiveTheme({ theme }: { theme: ThemeId }) {
  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0]
  return (
    <p
      aria-live="polite"
      className={css({
        hideBelow: 'lg',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '2',
        // A fixed width that fits the longest name (Everyday, Blueprint), so the badge
        // doesn't resize as the theme changes.
        w: '44',
        h: '9',
        px: '1.5',
        fontSize: 'sm',
        fontWeight: 'medium',
        bg: 'bg.surface',
        borderWidth: 'card',
        borderColor: 'border.default',
        rounded: 'full',
      })}
    >
      <span
        aria-hidden
        data-panda-theme={active.id}
        className={css({
          display: 'grid',
          placeItems: 'center',
          w: '6',
          h: '6',
          bg: 'accent.solid',
          color: 'accent.contrast',
          fontFamily: 'display',
          fontWeight: 'display',
          letterSpacing: 'display',
          fontSize: '[0.625rem]',
          rounded: 'full',
        })}
      >
        {active.monogram}
      </span>
      <span>
        <span className={css({ color: 'fg.muted', fontWeight: 'normal' })}>Theme: </span>
        {active.label}
      </span>
    </p>
  )
}

function Header({ theme, inspectorOpen, onToggleInspector }: { theme: ThemeId; inspectorOpen: boolean; onToggleInspector: () => void }) {
  return (
    <header
      {...CHROME}
      className={css({
        // Three columns, so the active theme sits at the true center whatever the sides hold.
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
      <ActiveTheme theme={theme} />
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2' })}>
        <button
          type="button"
          onClick={onToggleInspector}
          aria-expanded={inspectorOpen}
          // The inspector is only rendered while open, so only point at it then.
          aria-controls={inspectorOpen ? 'inspector' : undefined}
          title="Inspector (])"
          aria-label="Inspector"
          className={cx(secondaryAction(inspectorOpen), inspectorButtonPremeasure)}
        >
          {/* Both icons are rendered, so first-paint CSS can show the stored state's. */}
          <LuPanelRightClose data-shows="open" className={css({ display: inspectorOpen ? 'block' : 'none' })} />
          <LuPanelRightOpen data-shows="closed" className={css({ display: inspectorOpen ? 'none' : 'block' })} />
          {/* Icon-only on phones, so the header fits the widest theme faces (Pixel). */}
          <span className={css({ hideBelow: 'sm' })}>Inspector</span>
        </button>
        <UseTheme theme={theme} />
        <ModeSwitch />
      </div>
    </header>
  )
}

// A slim footer under the panels, in the header's quiet style.

const footerLink = css({
  color: 'fg.default',
  textDecorationLine: 'underline',
  textDecorationColor: 'border.default',
  textUnderlineOffset: '[3px]',
  rounded: 'mark',
  transitionProperty: 'text-decoration-color',
  transitionDuration: '[150ms]',
  _hover: { textDecorationColor: 'fg.default' },
  _focusVisible: { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5' },
})

// The marks of the two libraries the site is built with, at text size beside their names.
const libraryMark = css({ display: 'inline-block', w: '4', h: '4', me: '1.5', verticalAlign: '[-3px]' })

function PandaMark() {
  return (
    <svg viewBox="0 0.3 33.05 33.4" fill="none" aria-hidden className={libraryMark}>
      <path d="M0 4.12886C0 2.01551 1.71321 0.302307 3.82656 0.302307H29.221C31.3343 0.302307 33.0475 2.01551 33.0475 4.12886V29.8711C33.0475 31.9845 31.3343 33.6977 29.221 33.6977H3.82656C1.71321 33.6977 0 31.9845 0 29.8711V4.12886Z" fill="#F6E458" />
      <path d="M21.1783 7.76704C19.355 7.24329 17.4952 7.17211 15.6 7.34161C14.5394 7.45181 13.5198 7.66234 12.5363 8.03177C10.4105 8.83028 8.81442 10.2132 7.86268 12.2955C7.18036 13.7883 6.93376 15.374 6.90806 17.0011C6.8809 18.7205 7.09638 20.4162 7.43877 22.0974C7.74912 23.6212 8.16242 25.1152 8.75268 26.5574C8.80876 26.6944 8.87861 26.7406 9.02829 26.7403C10.8951 26.7363 12.762 26.7363 14.6289 26.7363C15.1815 26.7363 15.7342 26.7363 16.2869 26.7362C16.3292 26.7362 16.3715 26.7339 16.4202 26.7312C16.445 26.7299 16.4715 26.7284 16.5005 26.7271C16.4893 26.7004 16.4793 26.6759 16.4698 26.6529C16.4514 26.6077 16.4353 26.5684 16.4173 26.5299C16.2823 26.2411 16.1445 25.9536 16.0067 25.666C15.7078 25.0422 15.409 24.4184 15.1387 23.7824C14.3188 21.8537 13.691 19.8678 13.4994 17.7657C13.4149 16.8382 13.4266 15.916 13.684 15.0122C13.9781 13.9791 14.6093 13.2498 15.6558 12.9449C16.6168 12.665 17.5912 12.6668 18.5469 12.9759C19.3999 13.2517 19.956 13.8344 20.1926 14.7068C20.3743 15.3768 20.3742 16.054 20.2368 16.7295C20.1309 17.2495 19.9179 17.7241 19.5344 18.1037C18.8464 18.7847 17.9873 18.9413 17.0654 18.8891C16.9014 18.8798 16.7379 18.8619 16.5694 18.8433C16.4905 18.8347 16.4105 18.8259 16.3288 18.8178C16.3311 18.8439 16.3324 18.8679 16.3337 18.8904C16.336 18.9347 16.3381 18.9731 16.3472 19.0098C16.3865 19.1677 16.424 19.3262 16.4614 19.4847C16.5516 19.8665 16.6418 20.2483 16.7577 20.6221C16.9855 21.3561 17.2502 22.0725 17.5504 22.7719C19.6902 22.6049 21.661 22.073 23.7528 20.8173C23.7842 20.7975 23.8128 20.7796 23.8414 20.7618C24.7399 20.2024 25.4671 19.4768 25.9686 18.5398C26.7808 17.0224 26.9391 15.3997 26.6978 13.7248C26.4488 11.9962 25.6731 10.5453 24.3377 9.40723C23.4116 8.61786 22.3406 8.10091 21.1783 7.76704Z" fill="black" />
    </svg>
  )
}

function ArkMark() {
  return (
    <svg viewBox="0 0 512 512" fill="none" aria-hidden className={libraryMark}>
      <rect width="512" height="512" rx="254" fill="#EB5E41" />
      <path
        d="M231.089 204.512C213.27 256.575 195.503 308.425 177.857 360.315C176.886 363.171 175.618 364.044 172.603 364.034C139.296 363.913 105.988 363.958 72.6803 363.958C71.5973 363.958 70.5143 363.958 69 363.958C99.2736 274.397 129.405 185.258 159.555 96.0615C160.872 96.0615 161.985 96.0615 163.097 96.0615C224.395 96.0612 285.692 96.0772 346.989 96C349.43 95.9969 350.556 96.6394 351.373 98.9802C381.583 185.583 411.862 272.163 442.128 358.746C442.4 359.523 442.622 360.316 443 361.529C390.332 361.529 337.906 361.529 285.137 361.529C285.137 386.911 285.137 411.902 285.137 436.894C284.919 436.929 284.701 436.965 284.483 437C263.855 378.743 243.227 320.485 222.445 261.796C223.73 261.685 224.773 261.517 225.817 261.517C248.022 261.501 270.227 261.505 292.432 261.504C298.956 261.504 299.791 260.378 297.652 254.338C285.545 220.153 273.428 185.971 261.314 151.789C259.982 148.03 258.722 144.242 257.262 140.533C256.87 139.539 256.436 137.922 255.137 137.922C253.839 137.922 253.401 139.61 253.045 140.632C248.464 153.765 243.978 166.932 239.468 180.09C236.701 188.162 233.934 196.234 231.089 204.512Z"
        fill="white"
      />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/estheragbaje', icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/folasadeagbaje/', icon: FaLinkedin },
  { label: 'Twitter', href: 'https://x.com/_estheradebayo', icon: FaXTwitter },
]

const socialLink = css({
  display: 'inline-grid',
  placeItems: 'center',
  w: '7',
  h: '7',
  color: 'fg.muted',
  rounded: 'control',
  transitionProperty: 'color',
  transitionDuration: '[150ms]',
  _hover: { color: 'fg.default' },
  _focusVisible: { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5' },
  '& svg': { w: '4', h: '4' },
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
        <span className={css({ color: 'fg.default', fontWeight: 'medium' })}>Theme Explorer</span>
        <span aria-hidden className={css({ mx: '2.5', color: 'fg.subtle' })}>|</span>
        Made with{' '}
        <a className={footerLink} href="https://panda-css.com" {...newTab}>
          <PandaMark />
          Panda CSS
          <NewTabHint />
        </a>{' '}
        &amp;{' '}
        <a className={footerLink} href="https://ark-ui.com" {...newTab}>
          <ArkMark />
          Ark UI
          <NewTabHint />
        </a>
      </p>
      <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
        <p>
          Created by <span className={css({ color: 'fg.default', fontWeight: 'medium' })}>Esther Adebayo</span>
        </p>
        <ul className={css({ display: 'flex', alignItems: 'center', gap: '0.5' })}>
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a className={socialLink} href={href} {...newTab} aria-label={`${label} (opens in a new tab)`}>
                <Icon aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
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
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout))
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
    <div
      data-premeasure={measured ? undefined : ''}
      className={css({ position: 'relative', isolation: 'isolate', display: 'flex', flexDirection: 'column', h: '[100dvh]', overflow: 'clip' })}
    >
      {/* The backdrop the panels float on, in the chrome's colors. */}
      <div aria-hidden {...CHROME} className={css({ position: 'absolute', inset: '0', zIndex: 'behind', bg: 'bg.surface' })} />
      <Header theme={theme} inspectorOpen={narrow ? drawerOpen : layout.inspectorOpen} onToggleInspector={toggleInspector} />
      <ThemeStrip theme={theme} />
      {/* The gutters sit outside the splitter, so its measured width is the panels' width.
          md: '4' (16px) is PANEL_SIZES.inset, which the head script's first-paint sizes use. */}
      <div className={css({ display: 'flex', flex: '1', minH: '0', px: { base: '0', md: '4' } })}>
      <Splitter.RootProvider ref={rootRef} value={splitter} data-animating={animating ? '' : undefined} data-premeasure={measured ? undefined : ''}
        // Ark makes the root overflow: hidden, which focus or scrollIntoView could scroll,
        // shifting every panel. Visible: it isn't a scroll container, and the preview's
        // shadow isn't cut off; each panel still clips its own content.
        className={css({ flex: '1', minW: '0', minH: '0', overflow: 'visible !important' })}
      >
        <Splitter.Panel
          id="rail"
          {...CHROME}
          data-collapsed={layout.railCollapsed ? '' : undefined}
          data-premeasure-size=""
          style={{ '--panel-collapsed-size': `${RAIL_COLLAPSED}px`, ...railPremeasure } as CSSProperties}
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
          className={inspectorGutter}
        />
        <Splitter.Panel id="inspector" {...CHROME} data-premeasure-size="" style={inspectorPremeasure} className={css({ hideBelow: 'md' })}>
          {/* Before measuring, the empty card holds the inspector's place: its panel is 0px
              wide unless the stored layout has it open. */}
          {!measured ? (
            <div className={panelCard} />
          ) : (
            (layout.inspectorOpen || animating) && (
              <div className={panelCard}>
                <Inspector theme={theme} isDark={isDark} onClose={closeInspector} />
              </div>
            )
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
