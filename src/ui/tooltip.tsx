'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Tooltip from '@/ui/tooltip'
import { Tooltip } from '@ark-ui/react/tooltip'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { tooltip } from '../../styled-system/recipes'

const { withRootProvider, withContext } = createSlotRecipeContext(tooltip)

export const Root = withRootProvider(Tooltip.Root)
export const Trigger = withContext(Tooltip.Trigger, 'trigger')
export const Arrow = withContext(Tooltip.Arrow, 'arrow')
export const ArrowTip = withContext(Tooltip.ArrowTip, 'arrowTip')
export const Positioner = withContext(Tooltip.Positioner, 'positioner')
export const Content = withContext(Tooltip.Content, 'content')
