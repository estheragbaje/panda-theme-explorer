'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as Avatar from '@/ui/avatar'
import { Avatar } from '@ark-ui/react/avatar'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { avatar } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(avatar)

export const Root = withProvider(Avatar.Root, 'root')
export const Image = withContext(Avatar.Image, 'image')
export const Fallback = withContext(Avatar.Fallback, 'fallback')
