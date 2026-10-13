import { css } from '../../styled-system/css'

// Phase 1 check page: shows the Everyday contract rendering. Replaced by the trip page in phase 4.
// colorPalette values are literals because Panda extracts styles at build time and
// can't see a value that only exists inside .map() at runtime.
const palettes = [
  { name: 'accent', className: css({ colorPalette: 'accent' }) },
  { name: 'neutral', className: css({ colorPalette: 'neutral' }) },
  { name: 'success', className: css({ colorPalette: 'success' }) },
  { name: 'warning', className: css({ colorPalette: 'warning' }) },
  { name: 'danger', className: css({ colorPalette: 'danger' }) },
]

export default function Home() {
  return (
    <main className={css({ maxW: '3xl', mx: 'auto', px: '6', py: '16', display: 'grid', gap: '8' })}>
      <header className={css({ display: 'grid', gap: '2' })}>
        <p className={css({ fontSize: 'xs', color: 'fg.muted', textTransform: 'uppercase', letterSpacing: 'widest' })}>
          Phase 1 · Everyday
        </p>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'display',
            letterSpacing: 'display',
            fontSize: '3xl',
            lineHeight: 'tight',
          })}
        >
          March invoices
        </h1>
        <p className={css({ color: 'fg.muted', maxW: 'prose' })}>
          Three are overdue, totalling $4,280.00, due 2 April.
        </p>
      </header>

      <section
        className={css({
          bg: 'bg.card',
          borderWidth: 'card',
          borderColor: 'border.default',
          rounded: 'card',
          shadow: 'raised',
          p: 'inset',
          display: 'grid',
          gap: '4',
        })}
      >
        <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '3' })}>
          <span className={css({ fontFamily: 'numeric', fontSize: '2xl', fontWeight: 'semibold', fontVariantNumeric: 'tabular-nums' })}>
            $4,280.00
          </span>
          <span
            className={css({
              colorPalette: 'danger',
              bg: 'colorPalette.subtle',
              color: 'colorPalette.text',
              rounded: 'badge',
              px: '2.5',
              py: '0.5',
              fontSize: 'xs',
              fontWeight: 'medium',
            })}
          >
            3 overdue
          </span>
        </div>
        <div className={css({ display: 'flex', gap: '2', flexWrap: 'wrap' })}>
          {palettes.map((palette) => (
            <button
              key={palette.name}
              type="button"
              className={`${palette.className} ${css({
                bg: 'colorPalette.solid',
                color: 'colorPalette.contrast',
                h: 'control.md',
                px: '4',
                rounded: 'control',
                fontWeight: 'button',
                letterSpacing: 'button',
                shadow: 'control',
                cursor: 'pointer',
                transitionProperty: 'translate, box-shadow',
                transitionDuration: 'fast',
                transitionTimingFunction: 'standard',
                _active: { pressOffset: 'press', shadow: 'pressed' },
                _focusVisible: { outlineWidth: 'control', outlineStyle: 'solid', outlineColor: 'focusRing', outlineOffset: '0.5' },
              })}`}
            >
              {palette.name}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
