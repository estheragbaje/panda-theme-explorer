'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Switch from '@/ui/switch'
import { Switch } from '@ark-ui/react/switch'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { switchRecipe } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(switchRecipe)

export const Root = withProvider(Switch.Root, 'root')
export const Control = withContext(Switch.Control, 'control')
export const Thumb = withContext(Switch.Thumb, 'thumb')
export const Label = withContext(Switch.Label, 'label')
export const HiddenInput = Switch.HiddenInput
