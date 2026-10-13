'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Drawer from '@/ui/drawer'
import { Drawer } from '@ark-ui/react/drawer'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { drawer } from '../../styled-system/recipes'

const { withRootProvider, withContext } = createSlotRecipeContext(drawer)

export const Root = withRootProvider(Drawer.Root)
export const Positioner = withContext(Drawer.Positioner, 'positioner')
export const Content = withContext(Drawer.Content, 'content')
export const Title = withContext(Drawer.Title, 'title')
export const Description = withContext(Drawer.Description, 'description')
export const Trigger = withContext(Drawer.Trigger, 'trigger')
export const Backdrop = withContext(Drawer.Backdrop, 'backdrop')
export const Grabber = withContext(Drawer.Grabber, 'grabber')
export const GrabberIndicator = withContext(Drawer.GrabberIndicator, 'grabberIndicator')
export const CloseTrigger = withContext(Drawer.CloseTrigger, 'closeTrigger')
export const SwipeArea = withContext(Drawer.SwipeArea, 'swipeArea')
