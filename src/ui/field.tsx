'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Field from '@/ui/field'
import { Field } from '@ark-ui/react/field'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { field } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(field)

export const Root = withProvider(Field.Root, 'root')
export const Label = withContext(Field.Label, 'label')
export const HelperText = withContext(Field.HelperText, 'helperText')
export const ErrorText = withContext(Field.ErrorText, 'errorText')
export const RequiredIndicator = withContext(Field.RequiredIndicator, 'requiredIndicator')
export const Input = Field.Input
export const Textarea = Field.Textarea
export const Select = Field.Select
