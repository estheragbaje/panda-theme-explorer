'use client'

import { Format } from '@ark-ui/react/format'
import { createContext, useContext, type ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { CURRENCIES, type CurrencyCode } from './data'

// The budget section's currency picker converts every price on the page.
export const CurrencyContext = createContext<{ currency: CurrencyCode; setCurrency: (c: CurrencyCode) => void }>({
  currency: 'USD',
  setCurrency: () => {},
})

export const useCurrency = () => useContext(CurrencyContext)

// A US-dollar amount, shown in the chosen currency.
export function Money({ usd, cents = true }: { usd: number; cents?: boolean }) {
  const { currency } = useCurrency()
  const rate = CURRENCIES.find((c) => c.value === currency)?.rate ?? 1
  return (
    <Format.Number
      value={usd * rate}
      style="currency"
      currency={currency}
      minimumFractionDigits={cents ? 2 : 0}
      maximumFractionDigits={cents ? 2 : 0}
    />
  )
}

// A page section. The heading id is what the section nav (Ark Toc) tracks, so it must
// match the value in SECTIONS.
export function Section({ id, title, description, action, children }: {
  id: string
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className={css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '6', scrollMarginTop: '16' })}>
      <header className={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4' })}>
        <div className={css({ display: 'grid', gap: '1', maxW: 'prose' })}>
          <h2 id={id} className={css({ textStyle: 'heading', scrollMarginTop: '20' })}>
            {title}
          </h2>
          <p className={css({ color: 'fg.muted' })}>{description}</p>
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
