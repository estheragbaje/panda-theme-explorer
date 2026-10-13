'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Progress from '@/ui/progress'
import { Progress } from '@ark-ui/react/progress'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { progress } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(progress)

export const Root = withProvider(Progress.Root, 'root')
export const Label = withContext(Progress.Label, 'label')
export const Track = withContext(Progress.Track, 'track')
export const Range = withContext(Progress.Range, 'range')
export const ValueText = withContext(Progress.ValueText, 'valueText')
export const View = withContext(Progress.View, 'view')
export const Circle = withContext(Progress.Circle, 'circle')
export const CircleTrack = withContext(Progress.CircleTrack, 'circleTrack')
export const CircleRange = withContext(Progress.CircleRange, 'circleRange')
