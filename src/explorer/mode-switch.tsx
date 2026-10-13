'use client'

import { Switch } from '@ark-ui/react/switch'
import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'
import { css, cx, viewTransition } from '../../styled-system/css'
import { switchRecipe } from '../../styled-system/recipes'
import { MODE_STORAGE_KEY, type Mode } from '../../theme/registry'

const modeTransitionClass = viewTransition('mode')

// Rapid toggles start a new transition before the last one ends. Only the latest one
// may remove the class, or it would cut the newer reveal short.
let latestTransition: ViewTransition | null = null
// During a transition the DOM (and so the switch) still shows the old mode for a frame.
// Toggles flip this intended mode instead, so two quick toggles always cancel out.
let intendedMode: Mode | null = null

// Same order as the head script: ?mode= first, then the stored choice, then light.
function readPreferredMode(): Mode {
  const fromUrl = new URLSearchParams(location.search).get('mode')
  if (fromUrl === 'dark' || fromUrl === 'light') return fromUrl
  try {
    return localStorage.getItem(MODE_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function applyMode(mode: Mode) {
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.style.colorScheme = mode
}

function persistMode(mode: Mode) {
  try {
    if (mode === 'dark') localStorage.setItem(MODE_STORAGE_KEY, 'dark')
    else localStorage.removeItem(MODE_STORAGE_KEY)
  } catch {}
  // Keep a ?mode= in the URL in step, or a reload would undo the switch.
  const url = new URL(location.href)
  if (url.searchParams.has('mode')) {
    if (mode === 'dark') url.searchParams.set('mode', 'dark')
    else url.searchParams.delete('mode')
    history.replaceState(history.state, '', url)
  }
}

// <html> is the source of truth; the switch only reflects it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  const onStorage = (event: StorageEvent) => {
    if (event.key === MODE_STORAGE_KEY) applyMode(event.newValue === 'dark' ? 'dark' : 'light')
  }
  window.addEventListener('storage', onStorage)
  return () => {
    observer.disconnect()
    window.removeEventListener('storage', onStorage)
  }
}
const getSnapshot = () => document.documentElement.classList.contains('dark')
const getServerSnapshot = () => false

export function ModeSwitch() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const controlRef = useRef<HTMLSpanElement>(null)
  const classes = switchRecipe({ size: 'md' })

  // In development, Strict Mode's remount resets <html> to its JSX attributes and drops
  // the class the head script added. Re-apply before paint. No-op in production.
  useLayoutEffect(() => {
    applyMode(readPreferredMode())
  }, [])

  function toggleMode() {
    const current = intendedMode ?? (getSnapshot() ? 'dark' : 'light')
    setMode(current === 'dark' ? 'light' : 'dark')
  }

  function setMode(mode: Mode) {
    persistMode(mode)
    const root = document.documentElement
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduceMotion) {
      applyMode(mode)
      return
    }
    // Grow the new mode in a circle from the centre of the switch.
    const rect = controlRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : 0
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    root.style.setProperty('--reveal-x', `${x}px`)
    root.style.setProperty('--reveal-y', `${y}px`)
    root.style.setProperty('--reveal-r', `${radius}px`)
    root.classList.add(modeTransitionClass)
    intendedMode = mode
    const transition = document.startViewTransition(() => applyMode(mode))
    latestTransition = transition
    transition.finished.finally(() => {
      if (latestTransition !== transition) return
      latestTransition = null
      intendedMode = null
      root.classList.remove(modeTransitionClass)
    })
  }

  return (
    <Switch.Root className={classes.root} checked={isDark} onCheckedChange={toggleMode} title="Dark mode">
      <Switch.Control ref={controlRef} className={classes.control}>
        <Switch.Thumb className={classes.thumb}>
          {isDark ? <LuMoon aria-hidden /> : <LuSun aria-hidden />}
        </Switch.Thumb>
      </Switch.Control>
      {/* The icon carries the meaning visually; the label stays for screen readers. */}
      <Switch.Label className={cx(classes.label, css({ srOnly: true }))}>Dark mode</Switch.Label>
      {/* Ark renders a plain checkbox; role="switch" makes screen readers announce a switch. */}
      <Switch.HiddenInput role="switch" />
    </Switch.Root>
  )
}
