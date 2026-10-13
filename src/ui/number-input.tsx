'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as NumberInput from '@/ui/number-input'
import { NumberInput } from '@ark-ui/react/number-input'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { numberInput } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(numberInput)

export const Root = withProvider(NumberInput.Root, 'root')
export const Label = withContext(NumberInput.Label, 'label')
export const Input = withContext(NumberInput.Input, 'input')
export const Control = withContext(NumberInput.Control, 'control')
export const ValueText = withContext(NumberInput.ValueText, 'valueText')
export const IncrementTrigger = withContext(NumberInput.IncrementTrigger, 'incrementTrigger')
export const DecrementTrigger = withContext(NumberInput.DecrementTrigger, 'decrementTrigger')
export const Scrubber = withContext(NumberInput.Scrubber, 'scrubber')
