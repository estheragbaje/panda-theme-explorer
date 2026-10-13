'use client'

// import * as Alert from '@/ui/alert'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { alert } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(alert)

export const Root = withProvider('div', 'root', { defaultProps: { role: 'status' } })
export const Icon = withContext('span', 'icon')
export const Content = withContext('div', 'content')
export const Title = withContext('p', 'title')
export const Description = withContext('p', 'description')
