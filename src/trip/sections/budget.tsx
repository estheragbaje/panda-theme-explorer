'use client'

import { createListCollection } from '@ark-ui/react/select'
import { Portal } from '@ark-ui/react/portal'
import { useState } from 'react'
import { LuCheck, LuChevronDown } from 'react-icons/lu'
import { css } from '../../../styled-system/css'
import * as Card from '../../ui/card'
import * as Progress from '../../ui/progress'
import * as Select from '../../ui/select'
import * as Slider from '../../ui/slider'
import { BUDGET, CURRENCIES, type CurrencyCode } from '../data'
import { Money, Section, useCurrency } from '../shared'

const currencies = createListCollection({ items: CURRENCIES.map((c) => ({ value: c.value, label: c.label })) })
const DAYS = 3

export function BudgetSection() {
  const { currency, setCurrency } = useCurrency()
  const [daily, setDaily] = useState([140])
  const planned = BUDGET.reduce((n, b) => n + b.planned, 0)
  const spent = BUDGET.reduce((n, b) => n + b.spent, 0)

  return (
    <Section
      id="budget"
      title="Budget"
      description="What you planned and what you've spent so far. Currency applies to every price on this page."
      action={
        <Select.Root
          collection={currencies}
          value={[currency]}
          onValueChange={(d) => setCurrency((d.value[0] ?? 'USD') as CurrencyCode)}
          positioning={{ sameWidth: true }}
          className={css({ w: '64' })}
        >
          <Select.Label>Currency</Select.Label>
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
                {currencies.items.map((item) => (
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
      }
    >
      <div className={css({ display: 'grid', gap: '4', gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/xl': 'repeat(2, minmax(0, 1fr))', '@preview/4xl': 'repeat(4, minmax(0, 1fr))' } })}>
        {BUDGET.map((item) => {
          const percent = Math.min(100, Math.round((item.spent / item.planned) * 100))
          return (
            <Card.Root key={item.id}>
              <Card.Body className={css({ gap: '3' })}>
                <p className={css({ textStyle: 'label', color: 'fg.muted' })}>{item.label}</p>
                <p>
                  <span className={css({ textStyle: 'numeric', fontSize: '2xl', fontWeight: 'semibold' })}>
                    <Money usd={item.spent} />
                  </span>
                  <span className={css({ display: 'block', fontSize: 'sm', color: 'fg.muted' })}>
                    of <Money usd={item.planned} /> planned
                  </span>
                </p>
                <Progress.Root value={percent} colorPalette={percent >= 100 ? 'warning' : 'accent'} aria-label={`${item.label}: ${percent}% of plan`}>
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              </Card.Body>
            </Card.Root>
          )
        })}
      </div>

      <div className={css({ layerStyle: 'surface', p: 'inset', display: 'grid', gap: '5', gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/3xl': '1fr 1fr' }, alignItems: 'center' })}>
        <Slider.Root value={daily} onValueChange={(d) => setDaily(d.value)} min={60} max={300} step={10}>
          <div className={css({ display: 'flex', justifyContent: 'space-between', gap: '2' })}>
            <Slider.Label>Daily spending money</Slider.Label>
            <span className={css({ textStyle: 'numeric', fontSize: 'sm', color: 'fg.muted' })}>
              <Money usd={daily[0]} cents={false} /> a day
            </span>
          </div>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} aria-label="Daily spending money">
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
        <dl className={css({ display: 'grid', gridTemplateColumns: '[auto auto]', justifyContent: 'space-between', rowGap: '1.5', columnGap: '6', fontSize: 'sm' })}>
          <dt className={css({ color: 'fg.muted' })}>Spending money, {DAYS} days</dt>
          <dd className={css({ textStyle: 'numeric', textAlign: 'end' })}>
            <Money usd={daily[0] * DAYS} cents={false} />
          </dd>
          <dt className={css({ color: 'fg.muted' })}>Spent so far</dt>
          <dd className={css({ textStyle: 'numeric', textAlign: 'end' })}>
            <Money usd={spent} />
          </dd>
          <dt className={css({ fontWeight: 'semibold' })}>Total planned</dt>
          <dd className={css({ textStyle: 'numeric', textAlign: 'end', fontWeight: 'semibold' })}>
            <Money usd={planned} />
          </dd>
        </dl>
      </div>
      <p className={css({ textStyle: 'caption', color: 'fg.muted' })}>Exchange rates are fixed approximations for this demo.</p>
    </Section>
  )
}
