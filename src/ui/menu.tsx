'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Menu from '@/ui/menu'
import { Menu } from '@ark-ui/react/menu'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { menu } from '../../styled-system/recipes'

const { withRootProvider, withContext } = createSlotRecipeContext(menu)

export const Root = withRootProvider(Menu.Root)
export const Trigger = withContext(Menu.Trigger, 'trigger')
export const Indicator = withContext(Menu.Indicator, 'indicator')
export const Positioner = withContext(Menu.Positioner, 'positioner')
export const Content = withContext(Menu.Content, 'content')
export const Item = withContext(Menu.Item, 'item')
export const ItemText = withContext(Menu.ItemText, 'itemText')
export const ItemGroup = withContext(Menu.ItemGroup, 'itemGroup')
export const ItemGroupLabel = withContext(Menu.ItemGroupLabel, 'itemGroupLabel')
export const Separator = withContext(Menu.Separator, 'separator')
