'use client'

// Slot recipes on native elements. Import as a namespace: import * as Card from '@/ui/card'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { card } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(card)

export const Root = withProvider('section', 'root')
export const Header = withContext('header', 'header')
export const Title = withContext('h3', 'title')
export const Description = withContext('p', 'description')
export const Body = withContext('div', 'body')
export const Footer = withContext('footer', 'footer')
