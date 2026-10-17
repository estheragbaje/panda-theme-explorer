// Checks every text and control pair the recipes use, in every theme, in both modes.
// Fails (exit 1) when a pair is under its WCAG minimum: 4.5:1 for text, 3:1 for
// large or non-text elements (placeholder-level text, focus rings, the switch track).
//
//   pnpm check:contrast
//
// Translucent colors are composited over the background they sit on. Surfaces that float
// over content (bg.overlay, bg.sticky) can sit over any photo, so when they're
// translucent they're also checked over pure black and pure white.
import { registerHooks } from 'node:module'

// The theme files use extensionless imports (bundler style); resolve them to .ts here.
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context)
    } catch (error) {
      if (specifier.startsWith('.')) return next(`${specifier}.ts`, context)
      throw error
    }
  },
})

// Node strips the types from the .ts theme files as it loads them.
const { themes } = await import('../theme/themes/index.ts')

// [foreground, background, minimum ratio, what it is]
const PAIRS = [
  ...['bg.canvas', 'bg.surface', 'bg.card', 'bg.subtle', 'bg.overlay', 'bg.sticky'].flatMap((bg) => [
    ['fg.default', bg, 4.5, 'body text'],
    ['fg.muted', bg, 4.5, 'secondary text'],
    ['fg.subtle', bg, 3, 'placeholders, switch track'],
    ['accent.text', bg, 4.5, 'links, selected items'],
    ['danger.text', bg, 4.5, 'field errors'],
    ['focusRing', bg, 3, 'focus ring'],
  ]),
  ...['accent', 'neutral', 'danger', 'success', 'warning'].flatMap((p) => [
    [`${p}.contrast`, `${p}.solid`, 4.5, 'solid button, solid badge'],
    [`${p}.text`, `${p}.subtle`, 4.5, 'tonal button, subtle badge, alert'],
  ]),
  ['fg.default', 'accent.subtle', 4.5, 'text in a selected radio card'],
  ['fg.muted', 'accent.subtle', 4.5, 'description in a selected radio card'],
  ['accent.solid', 'bg.surface', 3, 'checked control on a surface'],
  ['accent.solid', 'bg.canvas', 3, 'checked control on the canvas'],
  ['fg.inverse', 'bg.inverse', 4.5, 'tooltips'],
  ['highlight.fg', 'highlight.bg', 4.5, 'selection, marks'],
]

const FLOATING = ['bg.overlay', 'bg.sticky']

function lookup(tree, path) {
  let node = tree
  for (const key of path.split('.')) node = node?.[key]
  return node?.value
}

function resolve(colors, path, mode, seen = []) {
  if (seen.includes(path)) throw new Error(`circular reference: ${[...seen, path].join(' -> ')}`)
  const raw = lookup(colors, path)
  if (raw === undefined) throw new Error(`missing colors.${path}`)
  const value = typeof raw === 'string' ? raw : raw[mode]
  const ref = /^\{colors\.(.+)\}$/.exec(value)
  return ref ? resolve(colors, ref[1], mode, [...seen, path]) : value
}

function parse(color) {
  const hex = /^#([0-9a-f]{3,8})$/i.exec(color)?.[1]
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((c) => c + c).join('') : hex
    const n = full.match(/../g).map((h) => parseInt(h, 16))
    return [n[0], n[1], n[2], n.length === 4 ? n[3] / 255 : 1]
  }
  const rgb = /^rgba?\(([^)]+)\)$/.exec(color)?.[1]
  if (rgb) {
    const n = rgb.split(/[\s,/]+/).filter(Boolean).map(Number)
    return [n[0], n[1], n[2], n[3] ?? 1]
  }
  throw new Error(`unsupported color: ${color}`)
}

const over = (top, bottom) => {
  const a = top[3]
  return [0, 1, 2].map((i) => top[i] * a + bottom[i] * (1 - a)).concat(1)
}

const luminance = ([r, g, b]) => {
  const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

let failures = 0
let checked = 0
for (const [id, theme] of Object.entries(themes)) {
  const colors = theme.semanticTokens.colors
  for (const mode of ['base', '_dark']) {
    const canvas = parse(resolve(colors, 'bg.canvas', mode))
    for (const [fg, bg, min, use] of PAIRS) {
      const top = parse(resolve(colors, bg, mode))
      const behind = [['canvas', canvas]]
      if (FLOATING.includes(bg) && top[3] < 1) behind.push(['black', [0, 0, 0, 1]], ['white', [255, 255, 255, 1]])
      for (const [under, base] of behind) {
        const back = over(top, base)
        const value = ratio(over(parse(resolve(colors, fg, mode)), back), back)
        checked++
        if (value < min) {
          failures++
          const label = mode === 'base' ? 'light' : 'dark'
          console.log(`FAIL  ${id} ${label}  ${fg} on ${bg} over ${under}  ${value.toFixed(2)}:1 (needs ${min}:1, ${use})`)
        }
      }
    }
  }
}

console.log(`${checked - failures}/${checked} pairs pass across ${Object.keys(themes).length} theme(s), light and dark`)
process.exit(failures ? 1 : 0)
