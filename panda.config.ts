import { defineConfig } from '@pandacss/dev'
import { conditions } from './theme/global/conditions'
import { globalCss } from './theme/global/global-css'
import { pressOffset } from './theme/global/utilities'
import { keyframes, viewTransitions } from './theme/global/view-transitions'
import { breakpoints, containerSizes, primitives } from './theme/primitives'
import { recipes, slotRecipes } from './theme/recipes'
import { motionKeyframes } from './theme/styles/keyframes'
import { layerStyles } from './theme/styles/layer-styles'
import { textStyles } from './theme/styles/text-styles'
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
  conditions: { extend: conditions },
  utilities: { extend: { pressOffset } },
  globalCss,
  theme: {
    extend: {
      breakpoints,
      containers: containerSizes,
      tokens: primitives,
      // Everyday fills :root, so the page is fully styled before any theme attribute is set.
      semanticTokens: everyday.semanticTokens,
      keyframes: { ...keyframes, ...motionKeyframes },
      viewTransitions,
      textStyles,
      layerStyles,
      recipes,
      slotRecipes,
      containerNames: ['preview'],
    },
  },
  themes,
  // Every recipe variant is generated up front. Panda extracts styles statically, so a
  // variant chosen at runtime (status={item.status}) would otherwise get no CSS. A theme
  // explorer shows every component, so the full set is the right trade-off (~12KB gzipped).
  staticCss: { themes: THEME_IDS, recipes: '*' },
})
