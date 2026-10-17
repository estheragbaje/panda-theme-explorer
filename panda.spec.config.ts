import { defineConfig } from '@pandacss/dev'
import base from './panda.config'
import { THEME_IDS, type ThemeId } from './theme/registry'
import { themes } from './theme/themes'

// The config for one theme's design-system spec (scripts/build-specs.mjs runs it per
// theme). The theme's tokens are the base semantic tokens and there are no theme
// variants, so Panda Studio shows the theme on its own.
const id = process.env.PANDA_SPEC_THEME as ThemeId
if (!THEME_IDS.includes(id)) throw new Error(`PANDA_SPEC_THEME must be one of: ${THEME_IDS.join(', ')}`)

export default defineConfig({
  ...base,
  theme: { ...base.theme, extend: { ...base.theme?.extend, semanticTokens: themes[id].semanticTokens } },
  themes: {},
  staticCss: { ...base.staticCss, themes: [] },
})
