'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Splitter from '@/ui/splitter'
import { Splitter } from '@ark-ui/react/splitter'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { splitter } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(splitter)

export const Root = withProvider(Splitter.Root, 'root')
// For a splitter controlled from useSplitter().
export const RootProvider = withProvider(Splitter.RootProvider, 'root')
export const Panel = withContext(Splitter.Panel, 'panel')
export const ResizeTrigger = withContext(Splitter.ResizeTrigger, 'resizeTrigger')
export const ResizeTriggerIndicator = withContext(Splitter.ResizeTriggerIndicator, 'resizeTriggerIndicator')
