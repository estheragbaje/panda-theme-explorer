'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Collapsible from '@/ui/collapsible'
import { Collapsible } from '@ark-ui/react/collapsible'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { collapsible } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(collapsible)

export const Root = withProvider(Collapsible.Root, 'root')
export const Trigger = withContext(Collapsible.Trigger, 'trigger')
export const Content = withContext(Collapsible.Content, 'content')
export const Indicator = withContext(Collapsible.Indicator, 'indicator')
