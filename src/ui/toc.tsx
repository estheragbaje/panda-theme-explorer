'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Toc from '@/ui/toc'
import { Toc } from '@ark-ui/react/toc'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { toc } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(toc)

export const Root = withProvider(Toc.Root, 'root')
export const Title = withContext(Toc.Title, 'title')
export const List = withContext(Toc.List, 'list')
export const Item = withContext(Toc.Item, 'item')
export const Link = withContext(Toc.Link, 'link')
export const Indicator = withContext(Toc.Indicator, 'indicator')
export const Nav = Toc.Nav
export const Context = Toc.Context
export const Content = Toc.Content
