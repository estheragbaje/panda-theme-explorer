'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Tabs from '@/ui/tabs'
import { Tabs } from '@ark-ui/react/tabs'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { tabs } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(tabs)

export const Root = withProvider(Tabs.Root, 'root')
export const List = withContext(Tabs.List, 'list')
export const Trigger = withContext(Tabs.Trigger, 'trigger')
export const Content = withContext(Tabs.Content, 'content')
export const Indicator = withContext(Tabs.Indicator, 'indicator')
