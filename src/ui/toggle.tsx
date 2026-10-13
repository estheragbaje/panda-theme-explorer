'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Toggle from '@/ui/toggle'
import { Toggle } from '@ark-ui/react/toggle'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { toggle } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(toggle)

export const Root = withProvider(Toggle.Root, 'root')
export const Indicator = withContext(Toggle.Indicator, 'indicator')
