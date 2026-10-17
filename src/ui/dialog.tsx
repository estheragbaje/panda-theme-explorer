'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Dialog from '@/ui/dialog'
import { Dialog } from '@ark-ui/react/dialog'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { dialog } from '../../styled-system/recipes'

const { withRootProvider, withContext } = createSlotRecipeContext(dialog)

export const Root = withRootProvider(Dialog.Root)
export const Trigger = withContext(Dialog.Trigger, 'trigger')
export const Backdrop = withContext(Dialog.Backdrop, 'backdrop')
export const Positioner = withContext(Dialog.Positioner, 'positioner')
export const Content = withContext(Dialog.Content, 'content')
export const Title = withContext(Dialog.Title, 'title')
export const Description = withContext(Dialog.Description, 'description')
export const CloseTrigger = withContext(Dialog.CloseTrigger, 'closeTrigger')
