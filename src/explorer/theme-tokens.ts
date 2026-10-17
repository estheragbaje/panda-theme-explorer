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

// A theme's raw values by path and mode, before references are shown as "→ name".
function rawValues(id: ThemeId): Map<string, { light: string; dark: string }> {
  const out: { path: string; light: string; dark: string }[] = []
  const map = new Map<string, { light: string; dark: string }>()
  for (const [category, tree] of Object.entries(themes[id].semanticTokens)) {
    const start = out.length
    walkRaw(tree as Record<string, unknown>, category, [], out)
    for (const row of out.slice(start)) map.set(row.path, { light: row.light, dark: row.dark })
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

// Source formatting for the config, matching Prettier (single quotes): an object stays on
// one line while it fits in 80 columns and is expanded otherwise; a string that doesn't
// fit moves below its key, unless the key is 4 characters or fewer.
const WIDTH = 80
const IDENTIFIER = /^[a-zA-Z_$][\w$]*$/
// Single quotes, unless the string holds more single quotes than double ones (as Prettier).
const quote = (v: string) => {
  const q = (v.match(/'/g)?.length ?? 0) > (v.match(/"/g)?.length ?? 0) ? '"' : "'"
  return q + v.replace(/\\/g, '\\\\').replaceAll(q, `\\${q}`) + q
}
const key = (k: string) => (IDENTIFIER.test(k) ? k : quote(k))
function inline(v: unknown): string {
  if (typeof v === 'string') return quote(v)
  if (v && typeof v === 'object') return `{ ${Object.entries(v).map(([k, x]) => `${key(k)}: ${inline(x)}`).join(', ')} }`
  return String(v)
}
function property(k: string, v: unknown, indent: string): string {
  const flat = `${indent}${key(k)}: ${inline(v)},`
  if (flat.length <= WIDTH) return flat
  if (v && typeof v === 'object') {
    const inner = Object.entries(v).map(([k2, x]) => property(k2, x, indent + '  '))
    return `${indent}${key(k)}: {\n${inner.join('\n')}\n${indent}},`
  }
  return key(k).length <= 4 ? flat : `${indent}${key(k)}:\n${indent}  ${inline(v)},`
}

// The theme as a complete panda.config.ts, in the standard layout: its tokens are the
// config's semantic tokens, so they apply directly (no theme attribute) and _dark covers
// dark mode.
export function themeConfig(id: ThemeId): string {
  return [
    `import { defineConfig } from '@pandacss/dev';`,
    ``,
    `export default defineConfig({`,
    `  presets: ['@pandacss/preset-base'],`,
    ``,
    `  // Whether to use css reset`,
    `  preflight: true,`,
    ``,
    `  // Where to look for your css declarations`,
    `  include: ['./src/**/*.{js,jsx,ts,tsx}'],`,
    ``,
    `  // Files to exclude`,
    `  exclude: [],`,
    ``,
    `  // Useful for theme customization`,
    `  theme: {`,
    `    extend: {`,
    property('semanticTokens', themes[id].semanticTokens, '      '),
    `    },`,
    `  },`,
    ``,
    `  // The output directory for your css system`,
    `  outdir: 'styled-system',`,
    `});`,
    ``,
  ].join('\n')
}

function walkRaw(node: Record<string, unknown>, category: string, trail: string[], out: { path: string; light: string; dark: string }[]) {
  for (const [key, child] of Object.entries(node)) {
    if (!child || typeof child !== 'object') continue
    if ('value' in child) {
      const value = (child as { value: Value }).value
      const light = typeof value === 'object' ? value.base : String(value)
      const dark = typeof value === 'object' ? (value._dark ?? value.base) : String(value)
      out.push({ path: `${category}.${[...trail, key].join('.')}`, light, dark })
    } else {
      walkRaw(child as Record<string, unknown>, category, [...trail, key], out)
    }
  }
}
