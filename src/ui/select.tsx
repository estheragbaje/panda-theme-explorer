'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Select from '@/ui/select'
import { Select, type SelectRootProps } from '@ark-ui/react/select'
import type { CollectionItem } from '@ark-ui/react/collection'
import type { JSX } from 'react'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { select } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(select)

// Re-typed so Ark's generic item type survives the wrapper (collection={...} stays typed).
export const Root = withProvider(Select.Root, 'root') as <T extends CollectionItem>(props: SelectRootProps<T>) => JSX.Element
export const Label = withContext(Select.Label, 'label')
export const Positioner = withContext(Select.Positioner, 'positioner')
export const Trigger = withContext(Select.Trigger, 'trigger')
export const Indicator = withContext(Select.Indicator, 'indicator')
export const ClearTrigger = withContext(Select.ClearTrigger, 'clearTrigger')
export const Item = withContext(Select.Item, 'item')
export const ItemText = withContext(Select.ItemText, 'itemText')
export const ItemIndicator = withContext(Select.ItemIndicator, 'itemIndicator')
export const ItemGroup = withContext(Select.ItemGroup, 'itemGroup')
export const ItemGroupLabel = withContext(Select.ItemGroupLabel, 'itemGroupLabel')
export const List = withContext(Select.List, 'list')
export const Content = withContext(Select.Content, 'content')
export const Control = withContext(Select.Control, 'control')
export const ValueText = withContext(Select.ValueText, 'valueText')
export const HiddenSelect = Select.HiddenSelect
