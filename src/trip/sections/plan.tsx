'use client'

import { ClientOnly } from '@ark-ui/react/client-only'
import { parseDate } from '@ark-ui/react/date-picker'
import { Portal } from '@ark-ui/react/portal'
import { useState } from 'react'
import { LuCalendar, LuChevronLeft, LuChevronRight, LuMinus, LuPlus } from 'react-icons/lu'
import { css } from '../../../styled-system/css'
import { button } from '../../../styled-system/recipes'
import * as Avatar from '../../ui/avatar'
import * as Card from '../../ui/card'
import * as DatePicker from '../../ui/date-picker'
import * as NumberInput from '../../ui/number-input'
import * as Tooltip from '../../ui/tooltip'
import { COMPANIONS, TRIP } from '../data'
import { Photo } from '../photo'

function TripDates() {
  return (
    // Today's date belongs to the visitor's timezone, so the picker renders on the client.
    <ClientOnly fallback={<div className={css({ h: '16' })} />}>
      <DatePicker.Root
        selectionMode="range"
        defaultValue={[parseDate(TRIP.start), parseDate(TRIP.end)]}
        startOfWeek={1}
        positioning={{ placement: 'bottom-start' }}
      >
        <DatePicker.Label>Dates</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input index={0} aria-label="Arrival" />
          <DatePicker.Input index={1} aria-label="Departure" />
          <DatePicker.Trigger aria-label="Open calendar">
            <LuCalendar />
          </DatePicker.Trigger>
        </DatePicker.Control>
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DatePicker.View view="day">
                <DatePicker.Context>
                  {(api) => (
                    <>
                      <DatePicker.ViewControl>
                        <DatePicker.PrevTrigger aria-label="Previous month">
                          <LuChevronLeft />
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger>
                          <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger aria-label="Next month">
                          <LuChevronRight />
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>
                      <DatePicker.Table>
                        <DatePicker.TableHead>
                          <DatePicker.TableRow>
                            {api.weekDays.map((day, i) => (
                              <DatePicker.TableHeader key={i}>{day.short}</DatePicker.TableHeader>
                            ))}
                          </DatePicker.TableRow>
                        </DatePicker.TableHead>
                        <DatePicker.TableBody>
                          {api.weeks.map((week, i) => (
                            <DatePicker.TableRow key={i}>
                              {week.map((day, j) => (
                                <DatePicker.TableCell key={j} value={day}>
                                  <DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                    </>
                  )}
                </DatePicker.Context>
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
    </ClientOnly>
  )
}

export function PlanSection() {
  const [travellers, setTravellers] = useState(3)
  const coming = COMPANIONS.slice(0, travellers)

  return (
    // The trip itself opens the page, so this section is a hero, not a titled Section.
    // The section carries the "plan" id the section nav tracks, so "Plan" scrolls to the
    // top of the photo, not to the title under it.
    <section id="plan" aria-labelledby="trip-title" className={css({ scrollMarginTop: '16' })}>
      <Card.Root>
        {/* Clips the photo to the card's corners, inside the card so decorations drawn
            outside it (Panda's ears) aren't clipped. Wide previews set the photo beside
            the plan; narrow ones stack it on top. */}
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/4xl': '[minmax(0, 1fr) minmax(0, 1fr)]' },
            rounded: 'inherit',
            overflow: 'hidden',
          })}
        >
          <Photo
            photo={TRIP.photo}
            preload
            sizes="(min-width: 80rem) 30rem, 100vw"
            className={css({ aspectRatio: { base: 'wide', '@preview/4xl': 'auto' }, minH: { '@preview/4xl': '[26rem]' } })}
          />
          <div className={css({ display: 'flex', flexDirection: 'column', minW: '0' })}>
            <Card.Body className={css({ gap: '6', pt: '6', flex: '1', justifyContent: { '@preview/4xl': 'center' } })}>
              <div className={css({ display: 'grid', gap: '2' })}>
                <p className={css({ textStyle: 'caption', color: 'fg.muted', textTransform: 'uppercase', letterSpacing: 'wider' })}>
                  Fri 13 to Sun 15 November 2026
                </p>
                <h1 id="trip-title" className={css({ textStyle: 'display', fontSize: { base: '3xl', '@preview/3xl': '4xl' } })}>
                  {TRIP.title}
                </h1>
                <p className={css({ color: 'fg.muted', maxW: 'prose' })}>Three days and two nights in the city by the bay. Pick your dates and who&apos;s coming.</p>
              </div>

              {/* Dates take the full row. Travellers is a fixed width beside who's coming, so
                  adding or removing an avatar never moves the input. */}
              <div
                className={css({
                  display: 'grid',
                  gap: '5',
                  alignItems: 'end',
                  gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/xl': '[10rem minmax(0, 1fr)]' },
                  '& > :first-child': { gridColumn: '1 / -1' },
                })}
              >
                <TripDates />
                <NumberInput.Root value={String(travellers)} min={1} max={COMPANIONS.length} onValueChange={(d) => setTravellers(d.valueAsNumber || 1)}>
                  <NumberInput.Label>Travellers</NumberInput.Label>
                  <NumberInput.Control>
                    <NumberInput.DecrementTrigger aria-label="Fewer travellers">
                      <LuMinus />
                    </NumberInput.DecrementTrigger>
                    <NumberInput.Input />
                    <NumberInput.IncrementTrigger aria-label="More travellers">
                      <LuPlus />
                    </NumberInput.IncrementTrigger>
                  </NumberInput.Control>
                </NumberInput.Root>

                <div className={css({ display: 'grid', gap: '1.5' })}>
                  <span className={css({ textStyle: 'label' })} id="whos-coming">
                    Who&apos;s coming
                  </span>
                  <ul aria-labelledby="whos-coming" className={css({ display: 'flex', alignItems: 'center', h: 'control.md', '& > li:not(:first-child)': { ms: '-1' } })}>
                    {coming.map((person) => (
                      <li key={person.initials}>
                        <Tooltip.Root openDelay={200} closeDelay={0}>
                          <Tooltip.Trigger asChild>
                            <button type="button" aria-label={person.name} className={css({ rounded: 'full', _focusVisible: { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5' } })}>
                              <Avatar.Root>
                                <Avatar.Fallback>{person.initials}</Avatar.Fallback>
                              </Avatar.Root>
                            </button>
                          </Tooltip.Trigger>
                          <Portal>
                            <Tooltip.Positioner>
                              <Tooltip.Content>
                                <Tooltip.Arrow>
                                  <Tooltip.ArrowTip />
                                </Tooltip.Arrow>
                                {person.name}
                              </Tooltip.Content>
                            </Tooltip.Positioner>
                          </Portal>
                        </Tooltip.Root>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className={css({ justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' })}>
              <p className={css({ fontSize: 'sm', color: 'fg.muted' })} aria-live="polite">
                {travellers} {travellers === 1 ? 'traveller' : 'travellers'}, {TRIP.nights} nights
              </p>
              <a href="#stays" className={button()}>
                Find stays
              </a>
            </Card.Footer>
          </div>
        </div>
      </Card.Root>
    </section>
  )
}
