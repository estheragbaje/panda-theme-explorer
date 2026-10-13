'use client'

// One app-wide toaster. Call toaster.create({ title, description }) anywhere; render
// <Toaster /> once near the root.
import { Portal } from '@ark-ui/react/portal'
import { Toast, Toaster as ArkToaster, createToaster } from '@ark-ui/react/toast'
import { LuX } from 'react-icons/lu'
import { createSlotRecipeContext } from '../../styled-system/jsx'
import { toast } from '../../styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(toast)

const Root = withProvider(Toast.Root, 'root')
const Title = withContext(Toast.Title, 'title')
const Description = withContext(Toast.Description, 'description')
const ActionTrigger = withContext(Toast.ActionTrigger, 'actionTrigger')
const CloseTrigger = withContext(Toast.CloseTrigger, 'closeTrigger')

export const toaster = createToaster({ placement: 'bottom-end', overlap: true, gap: 16 })

export function Toaster() {
  return (
    <Portal>
      <ArkToaster toaster={toaster}>
        {(item) => (
          <Root key={item.id}>
            {item.title && <Title>{item.title}</Title>}
            {item.description && <Description>{item.description}</Description>}
            {item.action && <ActionTrigger>{item.action.label}</ActionTrigger>}
            <CloseTrigger aria-label="Dismiss">
              <LuX />
            </CloseTrigger>
          </Root>
        )}
      </ArkToaster>
    </Portal>
  )
}
