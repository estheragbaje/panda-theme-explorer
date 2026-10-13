import { defineTextStyles } from '@pandacss/dev'

// Typography roles. Families, weights and tracking come from the contract, so one
// textStyle="heading" becomes a different face in every theme.
const display = { fontFamily: 'display', fontWeight: 'display', letterSpacing: 'display' }

export const textStyles = defineTextStyles({
  display: { value: { ...display, fontSize: '4xl', lineHeight: 'tight' } },
  heading: { value: { ...display, fontSize: '2xl', lineHeight: 'tight' } },
  title: { value: { ...display, fontSize: 'lg', lineHeight: 'snug' } },
  body: { value: { fontFamily: 'body', fontSize: 'body', lineHeight: 'normal' } },
  label: { value: { fontFamily: 'body', fontSize: 'sm', fontWeight: 'medium', lineHeight: 'snug' } },
  caption: { value: { fontFamily: 'body', fontSize: 'xs', lineHeight: 'normal' } },
  numeric: { value: { fontFamily: 'numeric', fontVariantNumeric: 'tabular-nums' } },
  code: { value: { fontFamily: 'mono', fontSize: 'sm' } },
})
