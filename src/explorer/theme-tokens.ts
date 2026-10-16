import { token } from '../../styled-system/tokens'
import type { Token } from '../../styled-system/types/tokens'
import { DEFAULT_THEME, THEMES, type ThemeId } from '../../theme/registry'
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

// A theme's raw values by path and mode, before references are shown as "→ name".
function rawValues(id: ThemeId): Map<string, { light: string; dark: string }> {
  const out: { cssVar: string; light: string; dark: string; path?: string }[] = []
  const map = new Map<string, { light: string; dark: string }>()
  for (const [category, tree] of Object.entries(themes[id].semanticTokens)) {
    const start = out.length
    walkRaw(tree as Record<string, unknown>, category, [], out, false)
    for (const row of out.slice(start)) map.set(row.path!, { light: row.light, dark: row.dark })
  }
  return map
}

// Follows {category.path} references within the theme, so an alias compares by what it
// resolves to: Everyday's and Riso's bg.card are both {colors.bg.surface}, but the
// surfaces differ.
function resolve(values: Map<string, { light: string; dark: string }>, value: string, mode: 'light' | 'dark', depth = 0): string {
  if (depth > 8) return value
  return value.replace(/\{([a-zA-Z]+(?:\.[\w-]+)+)\}/g, (match, path: string) => {
    const target = values.get(path)
    return target ? resolve(values, target[mode], mode, depth + 1) : match
  })
}

// Tokens whose resolved value, in the given mode, differs from the baseline theme's.
export function differsFromBaseline(id: ThemeId, mode: 'light' | 'dark'): Set<string> {
  const base = rawValues(DEFAULT_THEME)
  const theme = rawValues(id)
  const changed = new Set<string>()
  for (const [path, value] of theme) {
    const b = base.get(path)
    if (!b || resolve(base, b[mode], mode) !== resolve(theme, value[mode], mode)) changed.add(path)
  }
  return changed
}

// The theme as a standalone file for any Panda v2 project: Panda's own defineThemeVariant,
// not this repo's contract helper, which only exists here.
export function themeSource(id: ThemeId): string {
  const body = JSON.stringify(themes[id], null, 2).replace(/"([a-zA-Z_$][\w$]*)":/g, '$1:')
  const label = THEMES.find((t) => t.id === id)?.label ?? id
  return [
    `// ${label}, from Panda Themes. Register it in panda.config.ts:`,
    `//   themes: { ${id} },`,
    `//   staticCss: { themes: ['${id}'] },`,
    `// then add data-panda-theme="${id}" to the element it should style, and the dark class for`,
    `// dark mode (Panda's _dark condition). Fonts are read from --font-* variables your project`,
    `// defines, for example with next/font.`,
    `import { defineThemeVariant } from '@pandacss/dev'`,
    ``,
    `export const ${id} = defineThemeVariant(${body})`,
    ``,
  ].join('\n')
}

// "{colors.bg.surface} solid" -> "var(--colors-bg-surface) solid"
const toCssValue = (value: string) => value.replace(/\{([a-zA-Z]+(?:\.[\w-]+)+)\}/g, (_, path: string) => token.var(path as Token))

function walkRaw(node: Record<string, unknown>, category: string, trail: string[], out: { cssVar: string; light: string; dark: string; path?: string }[], asCss = true) {
  for (const [key, child] of Object.entries(node)) {
    if (!child || typeof child !== 'object') continue
    if ('value' in child) {
      const value = (child as { value: Value }).value
      const light = typeof value === 'object' ? value.base : String(value)
      const dark = typeof value === 'object' ? (value._dark ?? value.base) : String(value)
      const path = `${category}.${[...trail, key].join('.')}`
      const cssVar = token.var(path as Token).replace(/^var\((.+)\)$/, '$1')
      out.push({ cssVar, path, light: asCss ? toCssValue(light) : light, dark: asCss ? toCssValue(dark) : dark })
    } else {
      walkRaw(child as Record<string, unknown>, category, [...trail, key], out, asCss)
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
