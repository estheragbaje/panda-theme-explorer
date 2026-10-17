'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Slider from '@/ui/slider'
import { Slider } from '@ark-ui/react/slider'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { slider } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(slider)

// The thumb's size (the recipe's 4.5 = 18px in every theme), so Ark can place the thumbs
// on the server instead of hiding them until it has measured one.
export const Root = withProvider(Slider.Root, 'root', { defaultProps: { thumbSize: { width: 18, height: 18 } } })
export const Label = withContext(Slider.Label, 'label')
export const Thumb = withContext(Slider.Thumb, 'thumb')
export const ValueText = withContext(Slider.ValueText, 'valueText')
export const Track = withContext(Slider.Track, 'track')
export const Range = withContext(Slider.Range, 'range')
export const Control = withContext(Slider.Control, 'control')
export const MarkerGroup = withContext(Slider.MarkerGroup, 'markerGroup')
export const Marker = withContext(Slider.Marker, 'marker')
export const DraggingIndicator = withContext(Slider.DraggingIndicator, 'draggingIndicator')
export const HiddenInput = Slider.HiddenInput
