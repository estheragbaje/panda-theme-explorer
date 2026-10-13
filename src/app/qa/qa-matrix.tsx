'use client'

import { ClientOnly } from '@ark-ui/react/client-only'
import { Portal } from '@ark-ui/react/portal'
import { createListCollection } from '@ark-ui/react/select'
import { parseDate } from '@ark-ui/react/date-picker'
import type { ReactNode } from 'react'
import {
  LuCalendar,
  LuCheck,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCircleAlert,
  LuCircleCheck,
  LuHeart,
  LuInfo,
  LuMinus,
  LuPlus,
  LuStar,
  LuTriangleAlert,
  LuX,
} from 'react-icons/lu'
import { css } from '../../../styled-system/css'
import { input } from '../../../styled-system/recipes'
import { ModeSwitch } from '../../explorer/mode-switch'
import { useTheme } from '../../explorer/theme-choice'
import { THEMES } from '../../../theme/registry'
import * as Alert from '../../ui/alert'
import * as Avatar from '../../ui/avatar'
import * as Card from '../../ui/card'
import * as Checkbox from '../../ui/checkbox'
import * as Collapsible from '../../ui/collapsible'
import * as DatePicker from '../../ui/date-picker'
import * as Drawer from '../../ui/drawer'
import * as Field from '../../ui/field'
import * as NumberInput from '../../ui/number-input'
import { Badge, Button, Input, Kbd, Textarea } from '../../ui/primitives'
import * as Progress from '../../ui/progress'
import * as RadioGroup from '../../ui/radio-group'
import * as RatingGroup from '../../ui/rating-group'
import * as SegmentGroup from '../../ui/segment-group'
import * as Select from '../../ui/select'
import * as Slider from '../../ui/slider'
import * as Splitter from '../../ui/splitter'
import * as Switch from '../../ui/switch'
import * as Table from '../../ui/table'
import * as Tabs from '../../ui/tabs'
import * as TagsInput from '../../ui/tags-input'
import { Toaster, toaster } from '../../ui/toast'
import * as Toggle from '../../ui/toggle'
import * as Tooltip from '../../ui/tooltip'

// Forced states use the same data attributes Panda's conditions match, so every
// state renders without a mouse or keyboard and can be screenshotted.
const hover = { 'data-hover': '' }
const focus = { 'data-focus-visible': '' }

const currencies = createListCollection({
  items: [
    { label: 'US dollar (USD)', value: 'usd' },
    { label: 'Euro (EUR)', value: 'eur' },
    { label: 'Pound sterling (GBP)', value: 'gbp' },
  ],
})

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className={css({ display: 'grid', gap: '5', py: '8', borderTopWidth: 'card', borderColor: 'border.default' })}>
      <h2 className={css({ textStyle: 'heading' })}>{title}</h2>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={css({ display: 'grid', gap: '2' })}>
      <p className={css({ textStyle: 'caption', color: 'fg.muted', textTransform: 'uppercase', letterSpacing: 'wider' })}>{label}</p>
      <div className={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3' })}>{children}</div>
    </div>
  )
}

function StarItems() {
  return (
    <RatingGroup.Context>
      {(api) =>
        api.items.map((index) => (
          <RatingGroup.Item key={index} index={index}>
            <LuStar />
          </RatingGroup.Item>
        ))
      }
    </RatingGroup.Context>
  )
}

export function QaMatrix() {
  // ?theme= picks the theme, as in the explorer.
  const themeId = useTheme()
  const theme = THEMES.find((t) => t.id === themeId)?.label
  return (
    <main className={css({ maxW: '5xl', mx: 'auto', px: '6', pb: '24' })}>
      <header
        className={css({
          position: 'sticky',
          top: '0',
          zIndex: 'sticky',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: '4',
          bg: 'bg.canvas',
          borderBottomWidth: 'card',
          borderColor: 'border.default',
        })}
      >
        <div>
          <p className={css({ textStyle: 'caption', color: 'fg.muted' })}>Hidden QA page</p>
          <h1 className={css({ textStyle: 'title' })}>Component state matrix · {theme}</h1>
        </div>
        <ModeSwitch />
      </header>

      <Section id="type" title="Typography">
        <p className={css({ textStyle: 'display' })}>A long weekend in San Francisco</p>
        <p className={css({ textStyle: 'heading' })}>Where to stay</p>
        <p className={css({ textStyle: 'title' })}>Hayes Valley loft</p>
        <p className={css({ textStyle: 'body', maxW: 'prose' })}>
          A two-bedroom loft on Linden Street, a short walk from the Civic Center BART station and the shops on Hayes Street.
        </p>
        <p className={css({ textStyle: 'label' })}>Check-in from 3:00 pm</p>
        <p className={css({ textStyle: 'caption', color: 'fg.muted' })}>Prices include taxes and fees</p>
        <p className={css({ textStyle: 'numeric', fontSize: '2xl' })}>$1,284.50</p>
        <p className={css({ textStyle: 'code' })}>var(--colors-accent-solid)</p>
      </Section>

      <Section id="button" title="Button">
        {(['solid', 'outline', 'tonal', 'ghost'] as const).map((variant) => (
          <Row key={variant} label={variant}>
            <Button variant={variant}>Book trip</Button>
            <Button variant={variant} {...hover}>Hover</Button>
            <Button variant={variant} {...focus}>Focus</Button>
            <Button variant={variant} disabled>Disabled</Button>
            <Button variant={variant} iconOnly aria-label="Add traveller">
              <LuPlus />
            </Button>
          </Row>
        ))}
        <Row label="sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="palettes (solid, tonal)">
          {(['accent', 'neutral', 'success', 'warning', 'danger'] as const).map((palette) => (
            <span key={palette} className={css({ display: 'inline-flex', gap: '2' })} data-palette={palette}>
              <Button colorPalette={palette}>{palette}</Button>
              <Button colorPalette={palette} variant="tonal">{palette}</Button>
            </span>
          ))}
        </Row>
      </Section>

      <Section id="badge" title="Badge and Kbd">
        {(['subtle', 'solid', 'outline'] as const).map((variant) => (
          <Row key={variant} label={variant}>
            <Badge variant={variant} colorPalette="neutral">Hayes Valley</Badge>
            <Badge variant={variant} colorPalette="accent">Free cancellation</Badge>
            <Badge variant={variant} colorPalette="success">Booked</Badge>
            <Badge variant={variant} colorPalette="warning">2 rooms left</Badge>
            <Badge variant={variant} colorPalette="danger">Sold out</Badge>
          </Row>
        ))}
        <Row label="kbd">
          <span className={css({ display: 'inline-flex', gap: '1', alignItems: 'center', fontSize: 'sm' })}>
            Press <Kbd>D</Kbd> for dark mode, <Kbd>[</Kbd> and <Kbd>]</Kbd> for the panels
          </span>
        </Row>
      </Section>

      <Section id="input" title="Input, Textarea, Field">
        <Row label="states">
          <Input placeholder="Search neighborhoods" className={css({ w: '56' })} />
          <Input defaultValue="Mission District" className={css({ w: '56' })} {...hover} />
          <Input defaultValue="North Beach" className={css({ w: '56' })} {...focus} />
          <Input defaultValue="Nob Hill" aria-invalid className={css({ w: '56' })} />
          <Input defaultValue="The Marina" disabled className={css({ w: '56' })} />
        </Row>
        <Row label="sizes">
          <Input size="sm" placeholder="Small" className={css({ w: '40' })} />
          <Input size="md" placeholder="Medium" className={css({ w: '40' })} />
          <Input size="lg" placeholder="Large" className={css({ w: '40' })} />
        </Row>
        <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: '1fr 1fr' }, gap: '6' })}>
          <Field.Root required>
            <Field.Label>
              Lead traveller email <Field.RequiredIndicator>*</Field.RequiredIndicator>
            </Field.Label>
            <Field.Input className={input()} placeholder="you@example.com" />
            <Field.HelperText>We send the booking confirmation here.</Field.HelperText>
          </Field.Root>
          <Field.Root invalid>
            <Field.Label>Lead traveller email</Field.Label>
            <Field.Input className={input()} defaultValue="mo@example" />
            <Field.ErrorText>Enter an email address like name@example.com.</Field.ErrorText>
          </Field.Root>
          <Field.Root>
            <Field.Label>Notes for your host</Field.Label>
            <Textarea placeholder="Arriving late on Friday, around 11 pm." />
          </Field.Root>
        </div>
      </Section>

      <Section id="choice" title="Checkbox, Radio, Switch">
        <Row label="checkbox">
          {(
            [
              ['Unchecked', {}],
              ['Checked', { defaultChecked: true }],
              ['Indeterminate', { checked: 'indeterminate' as const }],
              ['Invalid', { invalid: true }],
              ['Disabled', { disabled: true, defaultChecked: true }],
            ] as const
          ).map(([label, props]) => (
            <Checkbox.Root key={label} {...props}>
              <Checkbox.Control>
                <Checkbox.Indicator>
                  <LuCheck />
                </Checkbox.Indicator>
                <Checkbox.Indicator indeterminate>
                  <LuMinus />
                </Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.Label>{label}</Checkbox.Label>
              <Checkbox.HiddenInput />
            </Checkbox.Root>
          ))}
          <Checkbox.Root>
            <Checkbox.Control {...focus}>
              <Checkbox.Indicator>
                <LuCheck />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label>Focus</Checkbox.Label>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
        </Row>
        <Row label="radio group">
          <RadioGroup.Root defaultValue="balanced" orientation="horizontal">
            {['Relaxed', 'Balanced', 'Packed'].map((pace) => (
              <RadioGroup.Item key={pace} value={pace.toLowerCase()}>
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText>{pace}</RadioGroup.ItemText>
                <RadioGroup.ItemHiddenInput />
              </RadioGroup.Item>
            ))}
            <RadioGroup.Item value="focus">
              <RadioGroup.ItemControl {...focus} />
              <RadioGroup.ItemText>Focus</RadioGroup.ItemText>
              <RadioGroup.ItemHiddenInput />
            </RadioGroup.Item>
            <RadioGroup.Item value="disabled" disabled>
              <RadioGroup.ItemControl />
              <RadioGroup.ItemText>Disabled</RadioGroup.ItemText>
              <RadioGroup.ItemHiddenInput />
            </RadioGroup.Item>
          </RadioGroup.Root>
        </Row>
        <Row label="radio cards">
          <RadioGroup.Root variant="card" defaultValue="balanced" orientation="horizontal">
            {[
              ['relaxed', 'Relaxed', 'Two stops a day, long lunches'],
              ['balanced', 'Balanced', 'Three stops a day'],
              ['packed', 'Packed', 'Five stops, early starts'],
            ].map(([value, label, hint]) => (
              <RadioGroup.Item key={value} value={value} className={css({ w: '52' })}>
                <RadioGroup.ItemControl />
                <span className={css({ display: 'grid', gap: '0.5' })}>
                  <RadioGroup.ItemText className={css({ fontWeight: 'medium' })}>{label}</RadioGroup.ItemText>
                  <span className={css({ fontSize: 'sm', color: 'fg.muted' })}>{hint}</span>
                </span>
                <RadioGroup.ItemHiddenInput />
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </Row>
        <Row label="switch">
          <Switch.Root>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>Price alerts</Switch.Label>
            <Switch.HiddenInput />
          </Switch.Root>
          <Switch.Root defaultChecked>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>Add to calendar</Switch.Label>
            <Switch.HiddenInput />
          </Switch.Root>
          <Switch.Root>
            <Switch.Control {...focus}>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>Focus</Switch.Label>
            <Switch.HiddenInput />
          </Switch.Root>
          <Switch.Root disabled defaultChecked>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>Disabled</Switch.Label>
            <Switch.HiddenInput />
          </Switch.Root>
        </Row>
      </Section>

      <Section id="range" title="Segment, Slider, Number, Rating, Toggle">
        <Row label="segment group">
          <SegmentGroup.Root defaultValue="hotel">
            <SegmentGroup.Indicator />
            {['Hotel', 'Guesthouse', 'Apartment'].map((type) => (
              <SegmentGroup.Item key={type} value={type.toLowerCase()}>
                <SegmentGroup.ItemText>{type}</SegmentGroup.ItemText>
                <SegmentGroup.ItemControl />
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            ))}
          </SegmentGroup.Root>
        </Row>
        <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: '1fr 1fr' }, gap: '8' })}>
          <Slider.Root defaultValue={[150, 450]} min={150} max={600} step={10}>
            <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
              <Slider.Label>Price per night</Slider.Label>
              <Slider.ValueText />
            </div>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              {[0, 1].map((index) => (
                <Slider.Thumb key={index} index={index} aria-label={index === 0 ? 'Minimum price' : 'Maximum price'}>
                  <Slider.HiddenInput />
                </Slider.Thumb>
              ))}
            </Slider.Control>
          </Slider.Root>
          <Slider.Root defaultValue={[220]} min={100} max={400} disabled>
            <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
              <Slider.Label>Daily budget (disabled)</Slider.Label>
              <Slider.ValueText />
            </div>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb index={0}>
                <Slider.HiddenInput />
              </Slider.Thumb>
            </Slider.Control>
          </Slider.Root>
        </div>
        <Row label="number input, rating, toggle">
          <NumberInput.Root defaultValue="2" min={1} max={8} className={css({ w: '40' })}>
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
          <RatingGroup.Root count={5} defaultValue={4} readOnly>
            <RatingGroup.Label>Rated 4 of 5 (read only)</RatingGroup.Label>
            <RatingGroup.Control>
              <StarItems />
            </RatingGroup.Control>
            <RatingGroup.HiddenInput />
          </RatingGroup.Root>
          <RatingGroup.Root count={5} defaultValue={3}>
            <RatingGroup.Label>Your rating</RatingGroup.Label>
            <RatingGroup.Control>
              <StarItems />
            </RatingGroup.Control>
            <RatingGroup.HiddenInput />
          </RatingGroup.Root>
          <Toggle.Root aria-label="Save stay">
            <LuHeart />
          </Toggle.Root>
          <Toggle.Root aria-label="Saved stay" defaultPressed>
            <LuHeart />
          </Toggle.Root>
          <Toggle.Root aria-label="Save stay (focus)" {...focus}>
            <LuHeart />
          </Toggle.Root>
          <Toggle.Root aria-label="Save stay (disabled)" disabled>
            <LuHeart />
          </Toggle.Root>
        </Row>
      </Section>

      <Section id="select" title="Tags, Select, Date picker">
        <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: '1fr 1fr' }, gap: '8', alignItems: 'start' })}>
          <TagsInput.Root defaultValue={['Warm layers for the fog', 'Walking shoes', 'Clipper card']}>
            <TagsInput.Label>Your packing extras</TagsInput.Label>
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
              <TagsInput.Input placeholder="Add an item" />
            </TagsInput.Control>
            <TagsInput.HiddenInput />
          </TagsInput.Root>

          <Select.Root collection={currencies} defaultValue={['usd']} positioning={{ sameWidth: true }}>
            <Select.Label>Currency</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Choose a currency" />
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

          {/* Date pickers read today's date, which belongs to the visitor's timezone, so they
              render on the client only. The fallbacks keep their space to avoid layout shift. */}
          <ClientOnly fallback={<div className={css({ h: '16' })} />}>
          <DatePicker.Root selectionMode="range" defaultValue={[parseDate('2026-11-13'), parseDate('2026-11-15')]}>
            <DatePicker.Label>Trip dates</DatePicker.Label>
            <DatePicker.Control>
              <DatePicker.Input index={0} aria-label="Start date" />
              <DatePicker.Input index={1} aria-label="End date" />
              <DatePicker.Trigger aria-label="Open calendar">
                <LuCalendar />
              </DatePicker.Trigger>
            </DatePicker.Control>
          </DatePicker.Root>
          </ClientOnly>

          <ClientOnly fallback={<div className={css({ h: '80', w: '72' })} />}>
          <DatePicker.Root inline selectionMode="range" defaultValue={[parseDate('2026-11-13'), parseDate('2026-11-15')]} defaultFocusedValue={parseDate('2026-11-13')}>
            <div className={css({ layerStyle: 'surface', p: '3', w: 'fit' })}>
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
            </div>
          </DatePicker.Root>
          </ClientOnly>
        </div>
      </Section>

      <Section id="disclosure" title="Tabs, Collapsible, Tooltip">
        <Tabs.Root defaultValue="sat">
          <Tabs.List>
            <Tabs.Trigger value="fri">Fri 13</Tabs.Trigger>
            <Tabs.Trigger value="sat">Sat 14</Tabs.Trigger>
            <Tabs.Trigger value="sun">Sun 15</Tabs.Trigger>
            <Tabs.Trigger value="mon" disabled>
              Mon 16
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="fri">Ferry Building at 10:00, Golden Gate Park at 14:00.</Tabs.Content>
          <Tabs.Content value="sat">Walk the Golden Gate Bridge at 09:00, Alcatraz ferry at 13:30.</Tabs.Content>
          <Tabs.Content value="sun">Muir Woods day trip, leaving at 08:30.</Tabs.Content>
        </Tabs.Root>
        <div className={css({ display: 'grid', gap: '3', maxW: 'md' })}>
          <Collapsible.Root defaultOpen>
            <Collapsible.Trigger>
              Alcatraz ferry details
              <Collapsible.Indicator>
                <LuChevronDown />
              </Collapsible.Indicator>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p className={css({ pt: '2', fontSize: 'sm', color: 'fg.muted' })}>Pier 33. Arrive 30 minutes early; tickets are timed.</p>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Muir Woods parking
              <Collapsible.Indicator>
                <LuChevronDown />
              </Collapsible.Indicator>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p className={css({ pt: '2', fontSize: 'sm', color: 'fg.muted' })}>Parking reservations are required.</p>
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
        <Row label="tooltip (forced open)">
          <div className={css({ pt: '10' })}>
            <Tooltip.Root open>
              <Tooltip.Trigger asChild>
                <Button variant="outline">Check-in time</Button>
              </Tooltip.Trigger>
              <Tooltip.Positioner>
                <Tooltip.Content>
                  <Tooltip.Arrow>
                    <Tooltip.ArrowTip />
                  </Tooltip.Arrow>
                  From 3:00 pm
                </Tooltip.Content>
              </Tooltip.Positioner>
            </Tooltip.Root>
          </div>
        </Row>
      </Section>

      <Section id="feedback" title="Progress, Avatar, Alert">
        <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: '2fr 1fr' }, gap: '8', alignItems: 'center' })}>
          <Progress.Root value={82}>
            <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
              <Progress.Label>Budget used</Progress.Label>
              <Progress.ValueText />
            </div>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
          <Progress.Root value={64} className={css({ flexDirection: 'row', alignItems: 'center', gap: '3' })}>
            <Progress.Circle>
              <Progress.CircleTrack />
              <Progress.CircleRange />
            </Progress.Circle>
            <Progress.Label>9 of 14 packed</Progress.Label>
          </Progress.Root>
        </div>
        <Row label="avatars">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Avatar.Root key={size} size={size}>
              <Avatar.Fallback>MO</Avatar.Fallback>
            </Avatar.Root>
          ))}
          <div className={css({ display: 'flex', '& > *:not(:first-child)': { ms: '-2' } })}>
            {['MO', 'JK', 'AL', 'RD'].map((initials) => (
              <Avatar.Root key={initials}>
                <Avatar.Fallback>{initials}</Avatar.Fallback>
              </Avatar.Root>
            ))}
          </div>
        </Row>
        <div className={css({ display: 'grid', gap: '3' })}>
          {(
            [
              ['info', LuInfo, 'Ferry tickets are timed', 'Board within 15 minutes of your slot.'],
              ['success', LuCircleCheck, 'Hayes Valley loft is booked', 'Confirmation sent to mo@example.com.'],
              ['warning', LuTriangleAlert, 'Karl the Fog is due Saturday', 'Pack a warm layer for the bridge walk.'],
              ['danger', LuCircleAlert, 'Payment didn’t go through', 'Check your card details and try again.'],
            ] as const
          ).map(([status, Icon, title, description]) => (
            <Alert.Root key={status} status={status}>
              <Alert.Icon>
                <Icon />
              </Alert.Icon>
              <Alert.Content>
                <Alert.Title>{title}</Alert.Title>
                <Alert.Description>{description}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          ))}
        </div>
      </Section>

      <Section id="surface" title="Card and Table">
        <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: '1fr 1fr' }, gap: '6', alignItems: 'start' })}>
          <Card.Root>
            <Card.Header>
              <Card.Title>Hayes Valley loft</Card.Title>
              <Card.Description>2 bedrooms · Linden Street</Card.Description>
            </Card.Header>
            <Card.Body>
              <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' })}>
                <span className={css({ textStyle: 'numeric', fontSize: '2xl', fontWeight: 'semibold' })}>$312</span>
                <Badge colorPalette="accent">Free cancellation</Badge>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button variant="outline">Details</Button>
              <Button>Reserve</Button>
            </Card.Footer>
          </Card.Root>
          <Table.Root>
            <Table.Head>
              <Table.Row>
                <Table.Header>Category</Table.Header>
                <Table.Header data-numeric="">Planned</Table.Header>
                <Table.Header data-numeric="">Spent</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[
                ['Stays', '$936.00', '$936.00'],
                ['Food', '$420.00', '$318.40'],
                ['Transport', '$180.00', '$96.25'],
                ['Activities', '$240.00', '$171.00'],
              ].map(([category, planned, spent]) => (
                <Table.Row key={category}>
                  <Table.Cell>{category}</Table.Cell>
                  <Table.Cell data-numeric="">{planned}</Table.Cell>
                  <Table.Cell data-numeric="">{spent}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </Section>

      <Section id="layout" title="Splitter, Drawer, Toast">
        <div className={css({ h: '48', layerStyle: 'surface', overflow: 'hidden' })}>
          <Splitter.Root
            panels={[{ id: 'rail', minSize: 15, maxSize: 35 }, { id: 'canvas' }, { id: 'inspector', minSize: 20, maxSize: 40 }]}
            defaultSize={[22, 53, 25]}
          >
            <Splitter.Panel id="rail" className={css({ p: '3', fontSize: 'sm', color: 'fg.muted' })}>Theme rail</Splitter.Panel>
            <Splitter.ResizeTrigger id="rail:canvas" aria-label="Resize theme rail" />
            <Splitter.Panel id="canvas" className={css({ p: '3', fontSize: 'sm', bg: 'bg.subtle' })}>Preview canvas</Splitter.Panel>
            <Splitter.ResizeTrigger id="canvas:inspector" aria-label="Resize inspector" />
            <Splitter.Panel id="inspector" className={css({ p: '3', fontSize: 'sm', color: 'fg.muted' })}>Inspector</Splitter.Panel>
          </Splitter.Root>
        </div>
        <Row label="overlays">
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <Button variant="outline">Open inspector sheet</Button>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Grabber>
                    <Drawer.GrabberIndicator />
                  </Drawer.Grabber>
                  <Drawer.Title>Inspector</Drawer.Title>
                  <Drawer.Description>Tokens for the active theme.</Drawer.Description>
                  <Drawer.CloseTrigger aria-label="Close">
                    <LuX />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
          <Button
            variant="tonal"
            onClick={() => toaster.create({ title: 'Copied', description: 'var(--colors-accent-solid)' })}
          >
            Show toast
          </Button>
        </Row>
      </Section>
      <Toaster />
    </main>
  )
}
