import { Fragment } from 'react'
import { css } from '../../styled-system/css'
import { ITINERARY, STAYS, TRIP } from './data'

// Unsplash asks for the photographer and Unsplash to be credited, with referral links.
const ref = '?utm_source=panda_themes&utm_medium=referral'
const credits = [TRIP.photo, ...STAYS.map((s) => s.photo), ...ITINERARY.flatMap((d) => d.stops.map((s) => s.photo))]
  .map((p) => p.credit)
  .filter((c, i, all) => all.findIndex((o) => o.username === c.username) === i)

const link = css({
  color: 'fg.muted',
  textDecoration: 'underline',
  textDecorationColor: 'border.strong',
  textUnderlineOffset: '2px',
  _hover: { color: 'fg.default', textDecorationColor: 'currentColor' },
  _focusVisible: { outlineWidth: 'focus', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5', rounded: 'mark' },
})

export function PhotoCredits() {
  return (
    <footer className={css({ borderTopWidth: 'card', borderColor: 'border.default', pt: '6', fontSize: 'xs', color: 'fg.subtle', lineHeight: 'relaxed' })}>
      Photos on{' '}
      <a className={link} href={`https://unsplash.com/${ref}`}>
        Unsplash
      </a>{' '}
      by{' '}
      {credits.map((c, i) => (
        <Fragment key={c.username}>
          <a className={link} href={`https://unsplash.com/@${c.username}${ref}`}>
            {c.name}
          </a>
          {i < credits.length - 2 ? ', ' : i === credits.length - 2 ? ' and ' : '.'}
        </Fragment>
      ))}
    </footer>
  )
}
