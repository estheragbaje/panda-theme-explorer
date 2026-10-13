import { defineUtility } from '@pandacss/dev'

// Moves an element by the theme's spacing.press token on both axes. Riso sets it to 3px
// so buttons press into their shadow; every other theme sets 0px.
export const pressOffset = defineUtility({
  values: 'spacing',
  transform: (value: string) => ({ translate: `${value} ${value}` }),
})
