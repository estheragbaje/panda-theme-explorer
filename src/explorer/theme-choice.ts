'use client'

import { useLayoutEffect, useSyncExternalStore } from 'react'
import { viewTransition } from '../../styled-system/css'
import { DEFAULT_THEME, THEME_IDS, THEME_STORAGE_KEY, type ThemeId } from '../../theme/registry'

const themeTransitionClass = viewTransition('theme')
const isTheme = (value: string | null): value is ThemeId => !!value && (THEME_IDS as string[]).includes(value)

// Same order as the head script: ?theme= first, then the stored choice, then the default.
function readPreferredTheme(): ThemeId {
  const fromUrl = new URLSearchParams(location.search).get('theme')
  if (isTheme(fromUrl)) return fromUrl
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isTheme(stored)) return stored
  } catch {}
  return DEFAULT_THEME
}

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute('data-panda-theme', theme)
}

function persistTheme(theme: ThemeId) {
  try {
    if (theme === DEFAULT_THEME) localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {}
  const url = new URL(location.href)
  if (url.searchParams.has('theme')) {
    url.searchParams.set('theme', theme)
    history.replaceState(history.state, '', url)
  }
}

// <html data-panda-theme> is the source of truth; components only reflect it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-panda-theme'] })
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) applyTheme(isTheme(event.newValue) ? event.newValue : DEFAULT_THEME)
  }
  window.addEventListener('storage', onStorage)
  return () => {
    observer.disconnect()
    window.removeEventListener('storage', onStorage)
  }
}
const getSnapshot = (): ThemeId => {
  const value = document.documentElement.getAttribute('data-panda-theme')
  return isTheme(value) ? value : DEFAULT_THEME
}
const getServerSnapshot = (): ThemeId => DEFAULT_THEME

export function setTheme(theme: ThemeId) {
  if (theme === getSnapshot()) return
  persistTheme(theme)
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion) {
    applyTheme(theme)
    return
  }
  const root = document.documentElement
  root.classList.add(themeTransitionClass)
  document.startViewTransition(() => applyTheme(theme)).finished.finally(() => root.classList.remove(themeTransitionClass))
}

export function useTheme(): ThemeId {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  // Strict Mode's dev remount resets <html> attributes; re-apply before paint.
  useLayoutEffect(() => {
    applyTheme(readPreferredTheme())
  }, [])
  return theme
}
