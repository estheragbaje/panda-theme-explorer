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

// The design-system spec Panda writes at build time (panda codegen --spec), with every
// theme in it. Panda Studio reads this file.
const SPEC_PATH = '/design-system.json'
const STUDIO_URL = 'https://studio.panda-css.com/'

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
                <SpecTab />
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

function SpecTab() {
  const [spec, setSpec] = useState<string | null>(null)
  useEffect(() => {
    let live = true
    fetch(SPEC_PATH)
      .then((r) => r.text())
      .then((text) => live && setSpec(text))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [])

  return (
    // The actions sit in the code's top-right corner, outside the scrolling area.
    <div className={css({ position: 'relative', flex: '1', minH: '0', display: 'flex' })}>
      <pre className={code} tabIndex={0} aria-label="design-system.json">
        {spec ?? 'Loading…'}
      </pre>
      <div className={css({ position: 'absolute', top: '3', insetEnd: '5', display: 'flex', gap: '2' })}>
        <button type="button" className={cx(button({ variant: 'outline', size: 'sm' }), css({ bg: 'bg.surface' }))} onClick={() => download('design-system.json', SPEC_PATH)}>
          <LuDownload /> Download
        </button>
        <button
          type="button"
          className={cx(button({ variant: 'solid', size: 'sm' }), css({ colorPalette: 'neutral', shadow: 'none' }))}
          onClick={() => {
            download('design-system.json', SPEC_PATH)
            window.open(STUDIO_URL, '_blank', 'noopener,noreferrer')
          }}
        >
          <LuExternalLink /> Open in Panda Studio
        </button>
      </div>
    </div>
  )
}
