import { defineConfig } from '@pandacss/dev'
import { themeConditions } from './theme/global/conditions'
import { globalCss } from './theme/global/global-css'
import { pressOffset } from './theme/global/utilities'
import { keyframes, viewTransitions } from './theme/global/view-transitions'
import { breakpoints, containerSizes, primitives } from './theme/primitives'
import { switchRecipe } from './theme/recipes/switch'
import { THEME_IDS } from './theme/registry'
import { everyday, themes } from './theme/themes'

export default defineConfig({
  preflight: true,
  // preset-base only: utilities, conditions and patterns. Every color comes from a theme.
  presets: ['@pandacss/preset-base'],
  strictTokens: true,
  strictPropertyValues: true,
  jsxFramework: 'react',
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  conditions: { extend: themeConditions },
  utilities: { extend: { pressOffset } },
  globalCss,
  theme: {
    extend: {
      breakpoints,
      containers: containerSizes,
      tokens: primitives,
      // Everyday fills :root, so the page is fully styled before any theme attribute is set.
      semanticTokens: everyday.semanticTokens,
      keyframes,
      viewTransitions,
      slotRecipes: { switchRecipe },
      containerNames: ['preview'],
    },
  },
  themes,
  staticCss: { themes: THEME_IDS },
})
