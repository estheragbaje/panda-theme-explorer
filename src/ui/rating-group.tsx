'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as RatingGroup from '@/ui/rating-group'
import { RatingGroup } from '@ark-ui/react/rating-group'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { ratingGroup } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(ratingGroup)

export const Root = withProvider(RatingGroup.Root, 'root')
export const Label = withContext(RatingGroup.Label, 'label')
export const Item = withContext(RatingGroup.Item, 'item')
export const Control = withContext(RatingGroup.Control, 'control')
export const HiddenInput = RatingGroup.HiddenInput
export const Context = RatingGroup.Context
export const ItemContext = RatingGroup.ItemContext
