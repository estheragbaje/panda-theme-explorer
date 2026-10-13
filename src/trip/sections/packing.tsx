'use client'

import { useState } from 'react'
import { LuCheck, LuMinus, LuX } from 'react-icons/lu'
import { css } from '../../../styled-system/css'
import * as Card from '../../ui/card'
import * as Checkbox from '../../ui/checkbox'
import * as Progress from '../../ui/progress'
import * as TagsInput from '../../ui/tags-input'
import { PACKING } from '../data'
import { Section } from '../shared'

const initiallyPacked = PACKING.flatMap((g) => g.items.filter((i) => i.packed).map((i) => i.id))
const totalItems = PACKING.reduce((n, g) => n + g.items.length, 0)

export function PackingSection() {
  const [packed, setPacked] = useState<string[]>(initiallyPacked)
  const [extras, setExtras] = useState<string[]>(['Clipper card', 'Sunscreen'])

  const toggle = (ids: string[], on: boolean) =>
    setPacked((current) => (on ? [...new Set([...current, ...ids])] : current.filter((id) => !ids.includes(id))))

  return (
    <Section id="packing" title="Packing list" description="November in San Francisco is mild but foggy. Layers matter more than anything else.">
      <div className={css({ display: 'grid', gap: '5', gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/5xl': '2fr 1fr' }, alignItems: 'start' })}>
        <Card.Root>
          <Card.Body className={css({ gap: '6', gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/2xl': 'repeat(2, minmax(0, 1fr))', '@preview/4xl': 'repeat(3, minmax(0, 1fr))' }, display: 'grid' })}>
            {PACKING.map((group) => {
              const ids = group.items.map((i) => i.id)
              const done = ids.filter((id) => packed.includes(id)).length
              const groupState = done === 0 ? false : done === ids.length ? true : ('indeterminate' as const)
              return (
                <Checkbox.Group key={group.id} className={css({ alignContent: 'start' })}>
                  {/* The group box packs or unpacks the whole category. */}
                  <Checkbox.Root checked={groupState} onCheckedChange={(d) => toggle(ids, d.checked === true)}>
                    <Checkbox.Control>
                      {/* Ark shows an indicator only for its own state: checked, or indeterminate. */}
                      <Checkbox.Indicator>
                        <LuCheck />
                      </Checkbox.Indicator>
                      <Checkbox.Indicator indeterminate>
                        <LuMinus />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label className={css({ fontWeight: 'semibold' })}>
                      {group.label}{' '}
                      <span className={css({ fontWeight: 'normal', color: 'fg.muted', textStyle: 'numeric' })}>
                        {done}/{ids.length}
                      </span>
                    </Checkbox.Label>
                    <Checkbox.HiddenInput />
                  </Checkbox.Root>
                  <div className={css({ display: 'grid', gap: '2.5', ps: '7' })}>
                    {group.items.map((item) => {
                      const isPacked = packed.includes(item.id)
                      return (
                        <Checkbox.Root key={item.id} checked={isPacked} onCheckedChange={(d) => toggle([item.id], d.checked === true)}>
                          <Checkbox.Control>
                            <Checkbox.Indicator>
                              <LuCheck />
                            </Checkbox.Indicator>
                          </Checkbox.Control>
                          <Checkbox.Label className={css({ color: isPacked ? 'fg.muted' : 'fg.default', textDecoration: isPacked ? 'line-through' : 'none' })}>
                            {item.label}
                          </Checkbox.Label>
                          <Checkbox.HiddenInput />
                        </Checkbox.Root>
                      )
                    })}
                  </div>
                </Checkbox.Group>
              )
            })}
          </Card.Body>
        </Card.Root>

        <div className={css({ display: 'grid', gap: '5' })}>
          <Card.Root>
            <Card.Body className={css({ flexDirection: 'row', alignItems: 'center', gap: '4' })}>
              <Progress.Root value={Math.round((packed.length / totalItems) * 100)} className={css({ w: 'fit' })} aria-label="Packing progress">
                <Progress.Circle>
                  <Progress.CircleTrack />
                  <Progress.CircleRange />
                </Progress.Circle>
              </Progress.Root>
              <div>
                <p className={css({ textStyle: 'title' })} aria-live="polite">
                  {packed.length} of {totalItems} packed
                </p>
                <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                  {totalItems - packed.length === 0 ? 'Ready to go.' : `${totalItems - packed.length} still to pack`}
                </p>
              </div>
            </Card.Body>
          </Card.Root>
          <TagsInput.Root value={extras} onValueChange={(d) => setExtras(d.value)} max={10}>
            <TagsInput.Label>Your extras</TagsInput.Label>
            <TagsInput.Control>
              <TagsInput.Context>
                {(api) =>
                  api.value.map((value, index) => (
                    <TagsInput.Item key={value} index={index} value={value}>
                      <TagsInput.ItemPreview>
                        <TagsInput.ItemText>{value}</TagsInput.ItemText>
                        <TagsInput.ItemDeleteTrigger aria-label={`Remove ${value}`}>
                          <LuX />
                        </TagsInput.ItemDeleteTrigger>
                      </TagsInput.ItemPreview>
                      <TagsInput.ItemInput />
                    </TagsInput.Item>
                  ))
                }
              </TagsInput.Context>
              <TagsInput.Input placeholder="Add an item and press Enter" />
            </TagsInput.Control>
            <TagsInput.HiddenInput />
          </TagsInput.Root>
        </div>
      </div>
    </Section>
  )
}
