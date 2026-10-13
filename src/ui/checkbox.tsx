'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Checkbox from '@/ui/checkbox'
import { Checkbox } from '@ark-ui/react/checkbox'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { checkbox } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(checkbox)

export const Root = withProvider(Checkbox.Root, 'root')
export const Label = withContext(Checkbox.Label, 'label')
export const Control = withContext(Checkbox.Control, 'control')
export const Indicator = withContext(Checkbox.Indicator, 'indicator')
export const Group = withContext(Checkbox.Group, 'group')
export const HiddenInput = Checkbox.HiddenInput
