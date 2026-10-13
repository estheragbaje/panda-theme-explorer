'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as RadioGroup from '@/ui/radio-group'
import { RadioGroup } from '@ark-ui/react/radio-group'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { radioGroup } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(radioGroup)

export const Root = withProvider(RadioGroup.Root, 'root')
export const Label = withContext(RadioGroup.Label, 'label')
export const Item = withContext(RadioGroup.Item, 'item')
export const ItemText = withContext(RadioGroup.ItemText, 'itemText')
export const ItemControl = withContext(RadioGroup.ItemControl, 'itemControl')
export const Indicator = withContext(RadioGroup.Indicator, 'indicator')
export const ItemHiddenInput = RadioGroup.ItemHiddenInput
