'use client'

import { createListCollection } from '@ark-ui/react/select'
import { Portal } from '@ark-ui/react/portal'
import { useState } from 'react'
import { LuCheck, LuChevronDown } from 'react-icons/lu'
import { css } from '../../../styled-system/css'
import * as RadioGroup from '../../ui/radio-group'
import * as Select from '../../ui/select'
import * as Switch from '../../ui/switch'
import { LANGUAGES, PACES } from '../data'
import { Section } from '../shared'

const languages = createListCollection({ items: LANGUAGES })

const NOTIFICATIONS = [
  { id: 'price', label: 'Price drop alerts', hint: 'When a saved stay gets cheaper' },
  { id: 'reminders', label: 'Day-before reminders', hint: 'Tickets and reservations for tomorrow' },
  { id: 'summary', label: 'Weekly trip summary', hint: 'Every Monday until you leave' },
]

export function PreferencesSection() {
  const [pace, setPace] = useState('balanced')
  const [notify, setNotify] = useState<string[]>(['price', 'reminders'])

  return (
    <Section id="preferences" title="Preferences" description="How you like to travel. These shape the itinerary and the reminders you get.">
      <RadioGroup.Root
        variant="card"
        value={pace}
        onValueChange={(d) => setPace(d.value ?? 'balanced')}
        orientation="horizontal"
        className={css({ display: 'grid', gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/3xl': 'repeat(3, minmax(0, 1fr))' }, gap: '4' })}
      >
        <RadioGroup.Label className={css({ gridColumn: '1 / -1' })}>Trip pace</RadioGroup.Label>
        {PACES.map((p) => (
          <RadioGroup.Item key={p.value} value={p.value}>
            <RadioGroup.ItemControl />
            <span className={css({ display: 'grid', gap: '0.5' })}>
              <RadioGroup.ItemText className={css({ fontWeight: 'medium' })}>{p.label}</RadioGroup.ItemText>
              <span className={css({ fontSize: 'sm', color: 'fg.muted' })}>{p.hint}</span>
            </span>
            <RadioGroup.ItemHiddenInput />
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>

      <div className={css({ display: 'grid', gap: '6', gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/3xl': '2fr 1fr' }, alignItems: 'start' })}>
        <fieldset className={css({ layerStyle: 'surface', p: 'inset', display: 'grid', gap: '4' })}>
          <legend className={css({ textStyle: 'label', float: 'left', mb: '1' })}>Notifications</legend>
          {NOTIFICATIONS.map((n) => (
            <div key={n.id} className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4' })}>
              <div>
                <p aria-hidden className={css({ fontSize: 'sm', fontWeight: 'medium' })}>
                  {n.label}
                </p>
                <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>{n.hint}</p>
              </div>
              <Switch.Root
                checked={notify.includes(n.id)}
                onCheckedChange={(d) => setNotify((c) => (d.checked ? [...c, n.id] : c.filter((id) => id !== n.id)))}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label className={css({ srOnly: true })}>{n.label}</Switch.Label>
                <Switch.HiddenInput />
              </Switch.Root>
            </div>
          ))}
        </fieldset>

        <Select.Root collection={languages} defaultValue={['en']} positioning={{ sameWidth: true }}>
          <Select.Label>Language</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText />
              <Select.Indicator>
                <LuChevronDown />
              </Select.Indicator>
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {languages.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <LuCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      </div>
    </Section>
  )
}
