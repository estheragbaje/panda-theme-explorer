'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as SegmentGroup from '@/ui/segment-group'
import { SegmentGroup } from '@ark-ui/react/segment-group'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { segmentGroup } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(segmentGroup)

export const Root = withProvider(SegmentGroup.Root, 'root')
export const Label = withContext(SegmentGroup.Label, 'label')
export const Item = withContext(SegmentGroup.Item, 'item')
export const ItemText = withContext(SegmentGroup.ItemText, 'itemText')
export const ItemControl = withContext(SegmentGroup.ItemControl, 'itemControl')
export const Indicator = withContext(SegmentGroup.Indicator, 'indicator')
export const ItemHiddenInput = SegmentGroup.ItemHiddenInput
