'use client'

import { useLayoutEffect, useSyncExternalStore } from 'react'
import { viewTransition } from '../../styled-system/css'
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

export function useIsDark() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  // In development, Strict Mode's remount resets <html> to its JSX attributes and drops
  // the class the head script added. Re-apply before paint. No-op in production.
  useLayoutEffect(() => {
    applyMode(readPreferredMode())
  }, [])
  return isDark
}

// origin: the element the reveal grows from (the switch). Falls back to the top centre.
export function setMode(mode: Mode, origin?: Element | null) {
  persistMode(mode)
  const root = document.documentElement
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion) {
    applyMode(mode)
    return
  }
  const rect = origin?.getBoundingClientRect()
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

export function toggleMode(origin?: Element | null) {
  const current = intendedMode ?? (getSnapshot() ? 'dark' : 'light')
  setMode(current === 'dark' ? 'light' : 'dark', origin)
}
