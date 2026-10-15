'use client'

import { Clipboard } from '@ark-ui/react/clipboard'
import { Portal } from '@ark-ui/react/portal'
import type { ReactNode } from 'react'
import { LuBraces, LuCheck, LuChevronDown, LuCopy, LuDownload, LuExternalLink, LuFileCode } from 'react-icons/lu'
import { css, cx } from '../../styled-system/css'
import { button } from '../../styled-system/recipes'
import type { ThemeId } from '../../theme/registry'
import * as Menu from '../ui/menu'
import { toaster } from '../ui/toast'
import { themeCss, themeSource } from './theme-tokens'

// The design-system spec Panda writes at build time (panda codegen --spec), with every
// theme in it. Panda Studio reads this file.
const SPEC_PATH = '/design-system.json'
const STUDIO_URL = 'https://studio.panda-css.com/'

// Every export confirmation shares one toast id, so repeated actions replace the toast
// instead of stacking another.
const notify = (title: string, description: string) => toaster.create({ id: 'copied', title, description })

async function copy(text: string, title: string, description: string) {
  try {
    await navigator.clipboard.writeText(text)
    notify(title, description)
  } catch {
    notify('Copy failed', 'Your browser blocked clipboard access.')
  }
}

function download(filename: string, href: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.click()
}

function downloadText(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  download(filename, url)
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

// A split button: the main part copies the theme file in one click (the common case);
// the arrow opens every other way to take the theme out.
const half = cx(button({ variant: 'solid', size: 'md' }), css({ colorPalette: 'neutral', shadow: 'none' }))

export function ThemeExport({ theme }: { theme: ThemeId }) {
  const actions: Record<string, () => void> = {
    'copy-ts': () => copy(themeSource(theme), 'Theme copied', `${theme}.ts source, ready to paste`),
    'copy-css': () => copy(themeCss(theme), 'CSS variables copied', `${theme} theme, light and dark`),
    'download-ts': () => {
      downloadText(`${theme}.ts`, themeSource(theme), 'text/typescript')
      notify('Downloaded', `${theme}.ts`)
    },
    'download-css': () => {
      downloadText(`${theme}.css`, themeCss(theme), 'text/css')
      notify('Downloaded', `${theme}.css`)
    },
    'download-spec': () => {
      download('design-system.json', SPEC_PATH)
      notify('Downloaded', 'design-system.json, with all six themes')
    },
    // Studio can't load a spec from a URL yet, so this hands over the file and opens
    // Studio beside it. Once Studio accepts a spec URL, this becomes a single link.
    studio: () => {
      download('design-system.json', SPEC_PATH)
      window.open(STUDIO_URL, '_blank', 'noopener,noreferrer')
      // Drag, not Browse: Studio's Browse button only picks folders; a dropped file works.
      notify('design-system.json downloaded', 'Drag the file onto Panda Studio, now open in a new tab')
    },
  }

  return (
    <div role="group" aria-label="Export theme" className={css({ display: 'inline-flex' })}>
      <Clipboard.Root value={themeSource(theme)} onStatusChange={(d) => d.copied && notify('Theme copied', `${theme}.ts source, ready to paste`)}>
        <Clipboard.Trigger className={cx(half, css({ px: '3.5', borderEndRadius: 'none' }))} aria-label="Copy theme source">
          <Clipboard.Indicator copied={<LuCheck />}>
            <LuCopy />
          </Clipboard.Indicator>
          <span className={css({ hideBelow: 'md' })}>Copy theme</span>
        </Clipboard.Trigger>
      </Clipboard.Root>
      <Menu.Root positioning={{ placement: 'bottom-end', gutter: 6 }} onSelect={(d) => actions[d.value]?.()}>
        <Menu.Trigger
          aria-label="More ways to export the theme"
          className={cx(
            half,
            css({
              px: '2.5',
              borderStartRadius: 'none',
              // A hairline between the two halves, in the button's own contrast color.
              borderInlineStartWidth: 'card',
              borderInlineStartColor: 'colorPalette.contrast/20',
            }),
          )}
        >
          <Menu.Indicator>
            <LuChevronDown />
          </Menu.Indicator>
        </Menu.Trigger>
        <Portal>
          {/* The menu is part of the explorer's chrome, so it wears Everyday like the header. */}
          <Menu.Positioner data-panda-theme="everyday">
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>Copy</Menu.ItemGroupLabel>
                <Item value="copy-ts" icon={<LuFileCode />} hint=".ts">
                  Theme file
                </Item>
                <Item value="copy-css" icon={<LuBraces />} hint=".css">
                  CSS variables
                </Item>
              </Menu.ItemGroup>
              <Menu.Separator />
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>Download</Menu.ItemGroupLabel>
                <Item value="download-ts" icon={<LuDownload />}>
                  {theme}.ts
                </Item>
                <Item value="download-css" icon={<LuDownload />}>
                  {theme}.css
                </Item>
                <Item value="download-spec" icon={<LuDownload />}>
                  design-system.json
                </Item>
              </Menu.ItemGroup>
              <Menu.Separator />
              <Item value="studio" icon={<LuExternalLink />}>
                Open in Panda Studio
              </Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </div>
  )
}

function Item({ value, icon, hint, children }: { value: string; icon: ReactNode; hint?: string; children: ReactNode }) {
  return (
    <Menu.Item value={value}>
      {icon}
      <Menu.ItemText>{children}</Menu.ItemText>
      {hint && <span className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'fg.subtle' })}>{hint}</span>}
    </Menu.Item>
  )
}
