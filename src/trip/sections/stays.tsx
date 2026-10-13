'use client'

import { useMemo, useState } from 'react'
import { LuBedDouble, LuCheck, LuHeart, LuMapPin, LuRotateCcw, LuStar, LuStarHalf } from 'react-icons/lu'
import { css } from '../../../styled-system/css'
import * as Card from '../../ui/card'
import * as Checkbox from '../../ui/checkbox'
import { Badge, Button } from '../../ui/primitives'
import * as RatingGroup from '../../ui/rating-group'
import * as SegmentGroup from '../../ui/segment-group'
import * as Slider from '../../ui/slider'
import * as Toggle from '../../ui/toggle'
import { AMENITIES, STAYS, type Amenity, type Stay, type StayType } from '../data'
import { Money, Section } from '../shared'

const PRICE_MIN = 150
const PRICE_MAX = 600
const TYPES: { value: 'all' | StayType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'guesthouse', label: 'Guesthouse' },
  { value: 'apartment', label: 'Apartment' },
]
const TYPE_LABEL: Record<StayType, string> = { hotel: 'Hotel', guesthouse: 'Guesthouse', apartment: 'Apartment' }

function StayCard({ stay, saved, onSavedChange }: { stay: Stay; saved: boolean; onSavedChange: (saved: boolean) => void }) {
  return (
    <Card.Root as="article">
      {/* Clips the image to the card's corners; on the root it would also clip decorations
          drawn outside the card, like Panda's ears. */}
      <div className={css({ display: 'flex', flexDirection: 'column', flex: '1', rounded: 'inherit', overflow: 'hidden' })}>
        {/* Image area drawn from theme tokens: no stock photography. */}
        <div
          className={css({
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
            aspectRatio: 'wide',
            bg: 'bg.subtle',
            bgImage: 'canvas',
            bgSize: '{sizes.canvasTile}',
            color: 'fg.subtle',
            '& > svg': { w: '10', h: '10' },
          })}
        >
          <LuBedDouble aria-hidden />
          <div className={css({ position: 'absolute', top: '3', insetEnd: '3' })}>
            <Toggle.Root pressed={saved} onPressedChange={onSavedChange} aria-label={saved ? `Remove ${stay.name} from saved` : `Save ${stay.name}`}>
              <LuHeart />
            </Toggle.Root>
          </div>
        </div>
        <Card.Body className={css({ gap: '2' })}>
          <div className={css({ display: 'grid', gap: '0.5' })}>
            <h3 className={css({ textStyle: 'title' })}>{stay.name}</h3>
            <p className={css({ display: 'flex', alignItems: 'center', gap: '1', fontSize: 'sm', color: 'fg.muted', '& svg': { w: '3.5', h: '3.5' } })}>
              <LuMapPin aria-hidden /> {stay.neighborhood} · {TYPE_LABEL[stay.type]}
            </p>
          </div>
          {/* Read-only rating: decorative stars plus text. Ark's RatingGroup is an input
              (radio group), so it's used for the minimum-rating filter instead. */}
          <p className={css({ display: 'flex', alignItems: 'center', gap: '2', fontSize: 'sm' })}>
            <span aria-hidden className={css({ display: 'flex', gap: '0.5', '& svg': { w: '4', h: '4', fill: 'currentColor' } })}>
              {[1, 2, 3, 4, 5].map((star) => (
                <LuStar key={star} className={css({ color: star <= Math.round(stay.rating) ? 'warning.solid' : 'border.strong' })} />
              ))}
            </span>
            <span className={css({ textStyle: 'numeric' })}>
              {stay.rating.toFixed(1)}
              <span className={css({ srOnly: true })}> out of 5,</span>{' '}
              <span className={css({ color: 'fg.muted' })}>({stay.reviews.toLocaleString('en-US')}<span className={css({ srOnly: true })}> reviews</span>)</span>
            </span>
          </p>
          <div className={css({ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '2', flexWrap: 'wrap', pt: '1' })}>
            <p>
              <span className={css({ textStyle: 'numeric', fontSize: 'xl', fontWeight: 'semibold' })}>
                <Money usd={stay.pricePerNight} cents={false} />
              </span>
              <span className={css({ fontSize: 'sm', color: 'fg.muted' })}> / night</span>
            </p>
            {stay.freeCancellation && <Badge colorPalette="success">Free cancellation</Badge>}
          </div>
        </Card.Body>
      </div>
    </Card.Root>
  )
}

export function StaysSection() {
  // Starts below the most expensive stay ($455), so the filter visibly matters on load.
  const [price, setPrice] = useState<number[]>([PRICE_MIN, 450])
  const [type, setType] = useState<'all' | StayType>('all')
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [minRating, setMinRating] = useState(0)
  const [saved, setSaved] = useState<string[]>(['linden-loft'])

  const results = useMemo(
    () =>
      STAYS.filter(
        (stay) =>
          stay.pricePerNight >= price[0] &&
          stay.pricePerNight <= price[1] &&
          (type === 'all' || stay.type === type) &&
          amenities.every((a) => stay.amenities.includes(a)) &&
          stay.rating >= minRating,
      ),
    [price, type, amenities, minRating],
  )

  const reset = () => {
    setPrice([PRICE_MIN, PRICE_MAX])
    setType('all')
    setAmenities([])
    setMinRating(0)
  }

  return (
    <Section
      id="stays"
      title="Where to stay"
      description="Six places across the city. Prices are per night, taxes included."
      action={
        <p className={css({ fontSize: 'sm', color: 'fg.muted' })} aria-live="polite">
          {results.length} of {STAYS.length} stays · {saved.length} saved
        </p>
      }
    >
      <div
        className={css({
          layerStyle: 'surface',
          p: 'inset',
          display: 'grid',
          gap: '5',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/4xl': '1.2fr 1fr' },
        })}
      >
        <Slider.Root value={price} onValueChange={(d) => setPrice(d.value)} min={PRICE_MIN} max={PRICE_MAX} step={10} minStepsBetweenThumbs={5}>
          <div className={css({ display: 'flex', justifyContent: 'space-between', gap: '2' })}>
            <Slider.Label>Price per night</Slider.Label>
            <span className={css({ textStyle: 'numeric', fontSize: 'sm', color: 'fg.muted' })}>
              <Money usd={price[0]} cents={false} /> – <Money usd={price[1]} cents={false} />
            </span>
          </div>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} aria-label="Minimum price">
              <Slider.HiddenInput />
            </Slider.Thumb>
            <Slider.Thumb index={1} aria-label="Maximum price">
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>

        <div className={css({ display: 'grid', gap: '1.5', alignContent: 'start' })}>
          <span className={css({ textStyle: 'label' })} id="stay-type">
            Type
          </span>
          <SegmentGroup.Root aria-labelledby="stay-type" value={type} onValueChange={(d) => setType((d.value ?? 'all') as 'all' | StayType)} className={css({ flexWrap: 'wrap', justifySelf: 'start' })}>
            <SegmentGroup.Indicator />
            {TYPES.map((t) => (
              <SegmentGroup.Item key={t.value} value={t.value}>
                <SegmentGroup.ItemText>{t.label}</SegmentGroup.ItemText>
                <SegmentGroup.ItemControl />
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            ))}
          </SegmentGroup.Root>
        </div>

        <RatingGroup.Root count={5} allowHalf value={minRating} onValueChange={(d) => setMinRating(d.value)}>
          <RatingGroup.Label>Minimum guest rating</RatingGroup.Label>
          <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
            <RatingGroup.Control>
              <RatingGroup.Context>
                {(api) =>
                  api.items.map((index) => (
                    <RatingGroup.Item key={index} index={index}>
                      <RatingGroup.ItemContext>
                        {(item) => (item.half ? <LuStarHalf /> : <LuStar />)}
                      </RatingGroup.ItemContext>
                    </RatingGroup.Item>
                  ))
                }
              </RatingGroup.Context>
            </RatingGroup.Control>
            <span className={css({ fontSize: 'sm', color: 'fg.muted', textStyle: 'numeric' })}>{minRating === 0 ? 'Any' : `${minRating}+`}</span>
          </div>
          <RatingGroup.HiddenInput />
        </RatingGroup.Root>

        <fieldset className={css({ display: 'grid', gap: '2', gridColumn: '1 / -1' })}>
          <legend className={css({ textStyle: 'label', mb: '2' })}>Must have</legend>
          <div className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '3', columnGap: '5' })}>
            {AMENITIES.map((amenity) => (
              <Checkbox.Root
                key={amenity.value}
                checked={amenities.includes(amenity.value)}
                onCheckedChange={(d) =>
                  setAmenities((current) => (d.checked === true ? [...current, amenity.value] : current.filter((a) => a !== amenity.value)))
                }
              >
                <Checkbox.Control>
                  <Checkbox.Indicator>
                    <LuCheck />
                  </Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label>{amenity.label}</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
            ))}
          </div>
        </fieldset>
      </div>

      {results.length > 0 ? (
        <div
          className={css({
            display: 'grid',
            gap: '5',
            gridTemplateColumns: { base: 'minmax(0, 1fr)', '@preview/xl': 'repeat(2, minmax(0, 1fr))', '@preview/4xl': 'repeat(3, minmax(0, 1fr))' },
          })}
        >
          {results.map((stay) => (
            <StayCard
              key={stay.id}
              stay={stay}
              saved={saved.includes(stay.id)}
              onSavedChange={(on) => setSaved((current) => (on ? [...current, stay.id] : current.filter((id) => id !== stay.id)))}
            />
          ))}
        </div>
      ) : (
        <div className={css({ layerStyle: 'inset', p: '8', display: 'grid', justifyItems: 'center', gap: '3', textAlign: 'center' })}>
          <p className={css({ textStyle: 'title' })}>No stays match these filters</p>
          <p className={css({ color: 'fg.muted', maxW: 'sm' })}>Widen the price range, choose another type, or clear an amenity.</p>
          <Button variant="outline" onClick={reset}>
            <LuRotateCcw /> Reset filters
          </Button>
        </div>
      )}
    </Section>
  )
}
