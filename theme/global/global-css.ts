import { defineGlobalStyles } from '@pandacss/dev'

export const globalCss = defineGlobalStyles({
  // Hooks read by Panda's preflight (default border color, placeholder, selection, fonts).
  // Declared wherever a theme or mode is applied, because a variable that references
  // another variable resolves on the element that declares it; declaring them only on
  // :root would pin a themed rail row to the page's theme.
  ':root, [data-panda-theme], .dark': {
    '--global-font-body': '{fonts.body}',
    '--global-font-mono': '{fonts.mono}',
    '--global-color-border': '{colors.border.default}',
    '--global-color-placeholder': '{colors.fg.subtle}',
    '--global-color-selection': '{colors.highlight.bg}',
  },
  // An element that sets a theme also restates the theme's face and ink. font-family and
  // color inherit as resolved values, so without this, text inside a theme scope (the
  // explorer's Everyday chrome, a rail tile) would keep the page theme's font.
  '[data-panda-theme]': {
    fontFamily: 'body',
    color: 'fg.default',
  },
  html: {
    colorScheme: 'light',
  },
  '.dark': {
    colorScheme: 'dark',
  },
  body: {
    bg: 'bg.canvas',
    color: 'fg.default',
    fontFamily: 'body',
    fontSize: 'body',
    lineHeight: 'normal',
    WebkitFontSmoothing: 'antialiased',
  },
  // Reduced motion: transitions and animations become instant everywhere. !important in
  // the base layer beats normal declarations in the recipes and utilities layers.
  '@media (prefers-reduced-motion: reduce)': {
    '*, ::before, ::after': {
      animationDuration: '0.01ms !important',
      animationIterationCount: '1 !important',
      transitionDuration: '0.01ms !important',
      scrollBehavior: 'auto !important',
    },
  },
  '::selection': {
    bg: 'highlight.bg',
    color: 'highlight.fg',
  },
})
