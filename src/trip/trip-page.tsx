'use client'

import { useRef, useState } from 'react'
import type { TocActiveChangeDetails } from '@ark-ui/react/toc'
import { css } from '../../styled-system/css'
import * as Toc from '../ui/toc'
import { SECTIONS, type CurrencyCode } from './data'
import { BudgetSection } from './sections/budget'
import { ItinerarySection } from './sections/itinerary'
import { PackingSection } from './sections/packing'
import { PlanSection } from './sections/plan'
import { PreferencesSection } from './sections/preferences'
import { StaysSection } from './sections/stays'
import { CurrencyContext } from './shared'

// "A long weekend in San Francisco": the page every theme is previewed on. It is its own
// scroll container and the `preview` container that container queries measure, so it
// adapts to the width it's given (the canvas between the rail and the inspector), not
// to the window.
export function TripPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const navListRef = useRef<HTMLUListElement>(null)

  // Ark's autoScroll calls scrollIntoView on the active link, which also scrolls this
  // container (the nav lives inside it) and cancels a link click's smooth scroll. It's
  // off; this keeps only the horizontal nav list showing the current link.
  const keepCurrentLinkVisible = ({ activeIds }: TocActiveChangeDetails) => {
    const list = navListRef.current
    const link = list?.querySelector<HTMLElement>(`[href="#${activeIds[0]}"]`)
    if (!list || !link) return
    if (link.offsetLeft < list.scrollLeft || link.offsetLeft + link.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: link.offsetLeft - 16, behavior: 'smooth' })
    }
  }
  const [currency, setCurrency] = useState<CurrencyCode>('USD')

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <div
        ref={scrollRef}
        className={css({
          h: 'full',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          containerType: 'inline-size',
          containerName: 'preview',
          layerStyle: 'canvas',
        })}
      >
        <Toc.Root items={SECTIONS} scrollEl={() => scrollRef.current} autoScroll={false} onActiveChange={keepCurrentLinkVisible}>
          <Toc.Nav
            aria-label="Trip sections"
            className={css({
              position: 'sticky',
              top: '0',
              zIndex: 'sticky',
              bg: 'bg.canvas',
            })}
          >
            <Toc.Context>
              {({ activeIds }) => (
                <Toc.List ref={navListRef} className={css({ maxW: '5xl', mx: 'auto', px: { base: '4', '@preview/xl': '6' }, py: '2' })}>
                  {SECTIONS.map((item) => (
                    <Toc.Item key={item.value} item={item}>
                      {/* Every heading in view is "active"; only the first is current. */}
                      <Toc.Link href={`#${item.value}`} data-current={activeIds[0] === item.value ? '' : undefined} aria-current={activeIds[0] === item.value ? 'location' : undefined}>
                        {item.label}
                      </Toc.Link>
                    </Toc.Item>
                  ))}
                </Toc.List>
              )}
            </Toc.Context>
          </Toc.Nav>
          <Toc.Content className={css({ maxW: '5xl', mx: 'auto', px: { base: '4', '@preview/xl': '6' }, py: '10', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '16' })}>
            <PlanSection />
            <StaysSection />
            <ItinerarySection />
            <BudgetSection />
            <PackingSection />
            <PreferencesSection />
          </Toc.Content>
        </Toc.Root>
      </div>
    </CurrencyContext.Provider>
  )
}
