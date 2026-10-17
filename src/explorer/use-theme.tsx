'use client'

import { Clipboard } from '@ark-ui/react/clipboard'
import { Portal } from '@ark-ui/react/portal'
import { useEffect, useState } from 'react'
import { LuCheck, LuCode, LuCopy, LuDownload, LuExternalLink, LuX } from 'react-icons/lu'
import { css, cx } from '../../styled-system/css'
import { button } from '../../styled-system/recipes'
import { THEMES, type ThemeId } from '../../theme/registry'
import * as Dialog from '../ui/dialog'
import * as Tabs from '../ui/tabs'
import { themeConfig } from './theme-tokens'

// Each theme's design-system spec, written at build time (scripts/build-specs.mjs) with
// that theme as the base. Panda Studio reads these files.
const specPath = (theme: ThemeId) => `/specs/${theme}.json`
// Studio picks up a dropped file whose name ends in design-system.json.
const specFile = (theme: ThemeId) => `${theme}.design-system.json`
const STUDIO_URL = 'https://studio.panda-css.com/'

// Panda Studio opens a design system from its URL hash: #url=<https spec URL>, or
// #spec=gz:<gzip, base64url> carrying the spec itself (up to 200,000 characters).
// A deployed site links to its public spec; a local one carries the spec, since Studio
// (a public page) can't count on reaching this machine.
const isLocalHost = (host: string) => host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.local')
const STUDIO_PAYLOAD_LIMIT = 200_000

async function gzipBase64Url(text: string) {
  const gzipped = await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()
  const bytes = new Uint8Array(gzipped)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

async function studioLink(theme: ThemeId, spec: string): Promise<string | null> {
  if (location.protocol === 'https:' && !isLocalHost(location.hostname)) {
    return `${STUDIO_URL}#url=${encodeURIComponent(new URL(specPath(theme), location.origin).href)}`
  }
  const payload = `gz:${await gzipBase64Url(JSON.stringify(JSON.parse(spec)))}`
  return payload.length <= STUDIO_PAYLOAD_LIMIT ? `${STUDIO_URL}#spec=${payload}` : null
}
// The spec is thousands of lines; the tab shows this many until the user asks for all.
const PREVIEW_LINES = 60

// The dialog is part of the explorer's chrome, so it wears Everyday like the header.
const CHROME = { 'data-panda-theme': 'everyday' } as const

type Tab = 'config' | 'spec'

function download(filename: string, href: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.click()
}

const code = css({
  flex: '1',
  minH: '0',
  overflow: 'auto',
  p: '4',
  bg: 'bg.subtle',
  rounded: 'control',
  fontFamily: 'mono',
  fontSize: 'xs',
  lineHeight: 'relaxed',
  whiteSpace: 'pre',
  tabSize: '2',
})

// The header's primary action: the theme as code, in the formats a Panda project uses.
export function UseTheme({ theme }: { theme: ThemeId }) {
  // Kept while the explorer is open, so the dialog reopens on the tab used last.
  const [tab, setTab] = useState<Tab>('config')
  const label = THEMES.find((t) => t.id === theme)?.label ?? theme

  return (
    <Dialog.Root lazyMount unmountOnExit>
      <Dialog.Trigger className={cx(button({ variant: 'solid', size: 'md' }), css({ colorPalette: 'neutral', shadow: 'none', px: '3.5' }))}>
        <LuCode />
        <span className={css({ hideBelow: 'md' })}>Use theme</span>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop {...CHROME} />
        <Dialog.Positioner {...CHROME}>
          <Dialog.Content>
            <div className={css({ display: 'grid', gap: '1', pe: '10' })}>
              <Dialog.Title>{label} theme</Dialog.Title>
              <Dialog.Description>Add it to a Panda CSS project, or open the design system in Panda Studio.</Dialog.Description>
            </div>
            <Dialog.CloseTrigger aria-label="Close">
              <LuX />
            </Dialog.CloseTrigger>
            <Tabs.Root value={tab} onValueChange={(d) => setTab(d.value as Tab)} className={css({ flex: '1', minH: '0' })}>
              <Tabs.List>
                <Tabs.Trigger value="config">panda.config</Tabs.Trigger>
                <Tabs.Trigger value="spec">design-system.json</Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Content value="config" className={css({ flex: '1', minH: '0', display: 'flex', flexDirection: 'column', gap: '4', _hidden: { display: 'none' } })}>
                <ConfigTab theme={theme} />
              </Tabs.Content>
              <Tabs.Content value="spec" className={css({ flex: '1', minH: '0', display: 'flex', flexDirection: 'column', gap: '4', _hidden: { display: 'none' } })}>
                <SpecTab theme={theme} />
              </Tabs.Content>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

function ConfigTab({ theme }: { theme: ThemeId }) {
  const source = themeConfig(theme)
  return (
    // Copy sits in the code's top-right corner, outside the scrolling area, so it stays put.
    <div className={css({ position: 'relative', flex: '1', minH: '0', display: 'flex' })}>
      <pre className={code} tabIndex={0} aria-label="panda.config.ts">
        {source}
      </pre>
      <Clipboard.Root value={source} className={css({ position: 'absolute', top: '3', insetEnd: '5' })}>
        <Clipboard.Trigger className={cx(button({ variant: 'solid', size: 'sm' }), css({ colorPalette: 'neutral', shadow: 'none' }))}>
          <Clipboard.Indicator
            className={css({ display: 'inline-flex', alignItems: 'center', gap: '1.5' })}
            copied={
              <>
                <LuCheck /> Copied
              </>
            }
          >
            <LuCopy /> Copy
          </Clipboard.Indicator>
        </Clipboard.Trigger>
      </Clipboard.Root>
    </div>
  )
}

function SpecTab({ theme }: { theme: ThemeId }) {
  const [spec, setSpec] = useState<string | null>(null)
  const [studio, setStudio] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  useEffect(() => {
    let live = true
    fetch(specPath(theme))
      .then((r) => r.text())
      .then(async (text) => {
        if (!live) return
        setSpec(text)
        const link = await studioLink(theme, text)
        if (live) setStudio(link)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [theme])

  const lines = spec?.split('\n') ?? []
  const truncated = !showAll && lines.length > PREVIEW_LINES

  return (
    // The actions sit in the code's top-right corner, outside the scrolling area.
    <div className={css({ position: 'relative', flex: '1', minH: '0', display: 'flex' })}>
      <pre className={code} tabIndex={0} aria-label="design-system.json">
        {spec === null ? 'Loading…' : truncated ? lines.slice(0, PREVIEW_LINES).join('\n') : spec}
      </pre>
      {/* The preview fades out above the button that renders the rest. */}
      {truncated && (
        <div
          className={css({
            position: 'absolute',
            insetInline: '0',
            bottom: '0',
            display: 'flex',
            justifyContent: 'center',
            pt: '16',
            pb: '4',
            roundedBottom: 'control',
            bgGradient: 'to-t',
            gradientFrom: 'bg.subtle',
            gradientVia: 'bg.subtle',
            gradientTo: 'transparent',
          })}
        >
          <button type="button" className={cx(button({ variant: 'outline', size: 'sm' }), css({ bg: 'bg.surface' }))} onClick={() => setShowAll(true)}>
            View all {lines.length.toLocaleString('en-US')} lines
          </button>
        </div>
      )}
      <div className={css({ position: 'absolute', top: '3', insetEnd: '5', display: 'flex', gap: '2' })}>
        <button type="button" className={cx(button({ variant: 'outline', size: 'sm' }), css({ bg: 'bg.surface' }))} onClick={() => download(specFile(theme), specPath(theme))}>
          <LuDownload /> Download
        </button>
        {/* A real link once it's ready: Studio opens with this theme loaded. */}
        <a
          href={studio ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={studio ? undefined : true}
          className={cx(button({ variant: 'solid', size: 'sm' }), css({ colorPalette: 'neutral', shadow: 'none', '&[aria-disabled=true]': { opacity: 'disabled', pointerEvents: 'none' } }))}
        >
          <LuExternalLink /> Open in Panda Studio
          <span className={css({ srOnly: true })}> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  )
}
