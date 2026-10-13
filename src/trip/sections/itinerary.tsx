'use client'

import { Portal } from '@ark-ui/react/portal'
import { useState } from 'react'
import { LuChevronDown, LuTicket } from 'react-icons/lu'
import { css } from '../../../styled-system/css'
import * as Collapsible from '../../ui/collapsible'
import { Badge } from '../../ui/primitives'
import * as Switch from '../../ui/switch'
import * as Tabs from '../../ui/tabs'
import * as Tooltip from '../../ui/tooltip'
import { ITINERARY, type Stop } from '../data'
import { Section } from '../shared'

function StopItem({ stop, inCalendar, onCalendarChange }: { stop: Stop; inCalendar: boolean; onCalendarChange: (on: boolean) => void }) {
  return (
    <li
      className={css({
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '[4rem 1fr]',
        gap: '4',
        pb: '6',
        // The timeline line, drawn between stops.
        _before: { content: '""', position: 'absolute', top: '7', bottom: '0', insetStart: '[1.5rem]', w: '[1px]', bg: 'border.default' },
        _last: { pb: '0', _before: { display: 'none' } },
      })}
    >
      <time className={css({ textStyle: 'numeric', fontWeight: 'semibold', pt: '0.5' })}>{stop.time}</time>
      <div className={css({ display: 'grid', gap: '2', minW: '0' })}>
        <div className={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2' })}>
          <h3 className={css({ textStyle: 'title' })}>{stop.title}</h3>
          {stop.timedEntry && (
            <Tooltip.Root openDelay={200}>
              <Tooltip.Trigger asChild>
                <button type="button" className={css({ rounded: 'badge', _focusVisible: { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5' } })}>
                  <Badge colorPalette="warning">
                    <LuTicket /> Timed entry
                  </Badge>
                </button>
              </Tooltip.Trigger>
              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content>
                    <Tooltip.Arrow>
                      <Tooltip.ArrowTip />
                    </Tooltip.Arrow>
                    Book a time slot in advance
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Portal>
            </Tooltip.Root>
          )}
        </div>
        <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>{stop.place}</p>
        <Collapsible.Root>
          <Collapsible.Trigger className={css({ w: 'fit', fontSize: 'sm', color: 'accent.text', gap: '1' })}>
            Tips
            <Collapsible.Indicator>
              <LuChevronDown />
            </Collapsible.Indicator>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <p className={css({ pt: '1.5', fontSize: 'sm', maxW: 'prose' })}>{stop.tip}</p>
          </Collapsible.Content>
        </Collapsible.Root>
        <Switch.Root checked={inCalendar} onCheckedChange={(d) => onCalendarChange(d.checked)}>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>Add to calendar</Switch.Label>
          <Switch.HiddenInput />
        </Switch.Root>
      </div>
    </li>
  )
}

export function ItinerarySection() {
  const [calendar, setCalendar] = useState<string[]>(['alcatraz', 'muir-woods'])
  const total = ITINERARY.reduce((n, day) => n + day.stops.length, 0)

  return (
    <Section
      id="itinerary"
      title="Itinerary"
      description="A day-by-day plan. Open a stop for practical tips."
      action={
        <p className={css({ fontSize: 'sm', color: 'fg.muted' })} aria-live="polite">
          {calendar.length} of {total} stops in your calendar
        </p>
      }
    >
      <Tabs.Root defaultValue="fri">
        <Tabs.List>
          {ITINERARY.map((day) => (
            <Tabs.Trigger key={day.value} value={day.value}>
              {day.label}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {ITINERARY.map((day) => (
          <Tabs.Content key={day.value} value={day.value}>
            <p className={css({ textStyle: 'caption', color: 'fg.muted', mb: '4' })}>{day.date}</p>
            <ol>
              {day.stops.map((stop) => (
                <StopItem
                  key={stop.id}
                  stop={stop}
                  inCalendar={calendar.includes(stop.id)}
                  onCalendarChange={(on) => setCalendar((c) => (on ? [...c, stop.id] : c.filter((id) => id !== stop.id)))}
                />
              ))}
            </ol>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Section>
  )
}
