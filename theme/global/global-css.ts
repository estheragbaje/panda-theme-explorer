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
  '::selection': {
    bg: 'highlight.bg',
    color: 'highlight.fg',
  },
})
