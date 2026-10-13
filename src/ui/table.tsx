'use client'

// import * as Table from '@/ui/table'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { table } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(table)

export const Root = withProvider('table', 'root')
export const Caption = withContext('caption', 'caption')
export const Head = withContext('thead', 'head')
export const Body = withContext('tbody', 'body')
export const Row = withContext('tr', 'row')
export const Header = withContext('th', 'header')
export const Cell = withContext('td', 'cell')
