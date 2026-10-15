import { token } from '../../styled-system/tokens'
import type { Token } from '../../styled-system/types/tokens'
import { DEFAULT_THEME, type ThemeId } from '../../theme/registry'
import { themes } from '../../theme/themes'

// Reads a theme's contract tokens straight from its definition, for the inspector.

export type Group = 'Color' | 'Type' | 'Shape' | 'Depth' | 'Motion' | 'Assets' | 'Size'

export type TokenRow = {
  path: string // e.g. colors.bg.canvas
  category: string // e.g. colors
  name: string // e.g. bg.canvas
  group: Group
  cssVar: string // e.g. --colors-bg-canvas
  light: string
  dark: string
}

const GROUP: Record<string, Group> = {
  colors: 'Color',
  fonts: 'Type',
  fontSizes: 'Type',
  fontWeights: 'Type',
  letterSpacings: 'Type',
  radii: 'Shape',
  borderWidths: 'Shape',
  shadows: 'Depth',
  durations: 'Motion',
  easings: 'Motion',
  assets: 'Assets',
  sizes: 'Size',
  spacing: 'Size',
}

export const GROUP_ORDER: Group[] = ['Color', 'Type', 'Shape', 'Depth', 'Motion', 'Assets', 'Size']

type Value = string | number | { base: string; _dark?: string }

// "{colors.bg.surface}" -> "→ bg.surface"
const show = (value: string) => value.replace(/^\{[a-zA-Z]+\.(.+)\}$/, '→ $1')

function walk(node: Record<string, unknown>, category: string, trail: string[], out: TokenRow[]) {
  for (const [key, child] of Object.entries(node)) {
    if (!child || typeof child !== 'object') continue
    if ('value' in child) {
      const value = (child as { value: Value }).value
      const light = typeof value === 'object' ? value.base : String(value)
      const dark = typeof value === 'object' ? (value._dark ?? value.base) : String(value)
      const name = [...trail, key].join('.')
      const path = `${category}.${name}`
      const cssVar = token.var(path as Token).replace(/^var\((.+)\)$/, '$1')
      out.push({ path, category, name, group: GROUP[category] ?? 'Size', cssVar, light: show(light), dark: show(dark) })
    } else {
      walk(child as Record<string, unknown>, category, [...trail, key], out)
    }
  }
}

export function themeTokens(id: ThemeId): TokenRow[] {
  const rows: TokenRow[] = []
  for (const [category, tree] of Object.entries(themes[id].semanticTokens)) {
    walk(tree as Record<string, unknown>, category, [], rows)
  }
  return rows
}

// Tokens whose light or dark value differs from the baseline theme.
export function differsFromBaseline(id: ThemeId): Set<string> {
  const base = new Map(themeTokens(DEFAULT_THEME).map((r) => [r.path, r]))
  return new Set(
    themeTokens(id)
      .filter((r) => {
        const b = base.get(r.path)
        return !b || b.light !== r.light || b.dark !== r.dark
      })
      .map((r) => r.path),
  )
}

// The theme as source a developer can paste into theme/themes/<id>.ts.
export function themeSource(id: ThemeId): string {
  const body = JSON.stringify(themes[id], null, 2).replace(/"([a-zA-Z_$][\w$]*)":/g, '$1:')
  return `import { defineTheme } from '../contract'\n\nexport const ${id} = defineTheme(${body})\n`
}

// "{colors.bg.surface} solid" -> "var(--colors-bg-surface) solid"
const toCssValue = (value: string) => value.replace(/\{([a-zA-Z]+(?:\.[\w-]+)+)\}/g, (_, path: string) => token.var(path as Token))

function walkRaw(node: Record<string, unknown>, category: string, trail: string[], out: { cssVar: string; light: string; dark: string }[]) {
  for (const [key, child] of Object.entries(node)) {
    if (!child || typeof child !== 'object') continue
    if ('value' in child) {
      const value = (child as { value: Value }).value
      const light = typeof value === 'object' ? value.base : String(value)
      const dark = typeof value === 'object' ? (value._dark ?? value.base) : String(value)
      const cssVar = token.var(`${category}.${[...trail, key].join('.')}` as Token).replace(/^var\((.+)\)$/, '$1')
      out.push({ cssVar, light: toCssValue(light), dark: toCssValue(dark) })
    } else {
      walkRaw(child as Record<string, unknown>, category, [...trail, key], out)
    }
  }
}

// The theme as plain CSS custom properties, for projects that don't use Panda. Light
// values sit on :root; .dark overrides only what changes. Font tokens point at this
// project's next/font variables (--font-*), which a host project defines itself.
export function themeCss(id: ThemeId): string {
  const rows: { cssVar: string; light: string; dark: string }[] = []
  for (const [category, tree] of Object.entries(themes[id].semanticTokens)) {
    walkRaw(tree as Record<string, unknown>, category, [], rows)
  }
  const block = (selector: string, lines: string[]) => `${selector} {\n${lines.map((l) => `  ${l}`).join('\n')}\n}`
  return [
    `/* ${id} theme from Panda Themes. Add the .dark class to an ancestor for dark mode. */`,
    block(':root', rows.map((r) => `${r.cssVar}: ${r.light};`)),
    block('.dark', rows.filter((r) => r.dark !== r.light).map((r) => `${r.cssVar}: ${r.dark};`)),
    '',
  ].join('\n\n')
}
