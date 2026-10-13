'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as TagsInput from '@/ui/tags-input'
import { TagsInput } from '@ark-ui/react/tags-input'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { tagsInput } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(tagsInput)

export const Root = withProvider(TagsInput.Root, 'root')
export const Label = withContext(TagsInput.Label, 'label')
export const Control = withContext(TagsInput.Control, 'control')
export const Input = withContext(TagsInput.Input, 'input')
export const ClearTrigger = withContext(TagsInput.ClearTrigger, 'clearTrigger')
export const ItemPreview = withContext(TagsInput.ItemPreview, 'itemPreview')
export const ItemInput = withContext(TagsInput.ItemInput, 'itemInput')
export const ItemText = withContext(TagsInput.ItemText, 'itemText')
export const ItemDeleteTrigger = withContext(TagsInput.ItemDeleteTrigger, 'itemDeleteTrigger')
export const Item = TagsInput.Item
export const HiddenInput = TagsInput.HiddenInput
export const Context = TagsInput.Context
