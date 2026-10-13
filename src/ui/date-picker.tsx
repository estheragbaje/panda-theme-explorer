'use client'

// Generated wrapper: binds Ark's parts to the recipe's slots. Import as a namespace:
// import * as DatePicker from '@/ui/date-picker'
import { DatePicker } from '@ark-ui/react/date-picker'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { datePicker } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(datePicker)

export const Root = withProvider(DatePicker.Root, 'root')
export const Label = withContext(DatePicker.Label, 'label')
export const Control = withContext(DatePicker.Control, 'control')
export const Input = withContext(DatePicker.Input, 'input')
export const Trigger = withContext(DatePicker.Trigger, 'trigger')
export const ClearTrigger = withContext(DatePicker.ClearTrigger, 'clearTrigger')
export const Positioner = withContext(DatePicker.Positioner, 'positioner')
export const Content = withContext(DatePicker.Content, 'content')
export const View = withContext(DatePicker.View, 'view')
export const ViewControl = withContext(DatePicker.ViewControl, 'viewControl')
export const ViewTrigger = withContext(DatePicker.ViewTrigger, 'viewTrigger')
export const PrevTrigger = withContext(DatePicker.PrevTrigger, 'prevTrigger')
export const NextTrigger = withContext(DatePicker.NextTrigger, 'nextTrigger')
export const RangeText = withContext(DatePicker.RangeText, 'rangeText')
export const Table = withContext(DatePicker.Table, 'table')
export const TableHead = withContext(DatePicker.TableHead, 'tableHead')
export const TableBody = withContext(DatePicker.TableBody, 'tableBody')
export const TableRow = withContext(DatePicker.TableRow, 'tableRow')
export const TableHeader = withContext(DatePicker.TableHeader, 'tableHeader')
export const TableCell = withContext(DatePicker.TableCell, 'tableCell')
export const TableCellTrigger = withContext(DatePicker.TableCellTrigger, 'tableCellTrigger')
export const MonthSelect = withContext(DatePicker.MonthSelect, 'monthSelect')
export const YearSelect = withContext(DatePicker.YearSelect, 'yearSelect')
export const PresetTrigger = withContext(DatePicker.PresetTrigger, 'presetTrigger')
export const ValueText = withContext(DatePicker.ValueText, 'valueText')
export const Context = DatePicker.Context
