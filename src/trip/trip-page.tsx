'use client'

import { useEffect, useRef, useState } from 'react'
import { css } from '../../styled-system/css'
import * as Toc from '../ui/toc'
import { PhotoCredits } from './credits'
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
  const navRef = useRef<HTMLElement>(null)
  const navListRef = useRef<HTMLUListElement>(null)
  const [current, setCurrent] = useState(SECTIONS[0].value)
  // A clicked link is current at once and stays current while the smooth scroll travels
  // (passing other sections on the way); scroll tracking resumes once scrolling settles.
  const clickedRef = useRef<string | null>(null)
  const settleTimer = useRef<number | undefined>(undefined)
  const releaseClickedSoon = () => {
    window.clearTimeout(settleTimer.current)
    settleTimer.current = window.setTimeout(() => (clickedRef.current = null), 150)
  }

  // The current section comes from the scroll position, not from Ark's active ids: Ark
  // only counts a section while its heading is in view, so between headings (reading
  // the middle of Stays) it keeps a stale id. Here the current section is the last one
  // whose top has passed the nav; at the very bottom it's the last section.
  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    let frame = 0
    const update = () => {
      frame = 0
      const line = scroller.getBoundingClientRect().top + (navRef.current?.offsetHeight ?? 0) + 32
      let next = SECTIONS[0].value
      for (const { value } of SECTIONS) {
        const el = document.getElementById(value)
        const top = (el?.closest('section') ?? el)?.getBoundingClientRect().top
        if (top !== undefined && top <= line) next = value
      }
      if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) next = SECTIONS[SECTIONS.length - 1].value
      setCurrent(next)
    }
    const onScroll = () => {
      if (clickedRef.current) return releaseClickedSoon()
      if (!frame) frame = requestAnimationFrame(update)
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer.current)
    }
  }, [])

  // Ark's autoScroll calls scrollIntoView on the active link, which also scrolls this
  // container (the nav lives inside it) and cancels a link click's smooth scroll. It's
  // off; this keeps only the horizontal nav list showing the current link.
  useEffect(() => {
    const list = navListRef.current
    const link = list?.querySelector<HTMLElement>(`[href="#${current}"]`)
    if (!list || !link) return
    if (link.offsetLeft < list.scrollLeft || link.offsetLeft + link.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: link.offsetLeft - 16, behavior: 'smooth' })
    }
  }, [current])
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
        <Toc.Root items={SECTIONS} scrollEl={() => scrollRef.current} autoScroll={false}>
          <Toc.Nav
            ref={navRef}
            aria-label="Trip sections"
            className={css({
              position: 'sticky',
              top: '0',
              zIndex: 'sticky',
              bg: 'bg.canvas',
            })}
          >
            <Toc.List ref={navListRef} className={css({ maxW: '5xl', mx: 'auto', px: { base: '4', '@preview/xl': '6' }, pt: '4', pb: '2' })}>
              {SECTIONS.map((item) => (
                <Toc.Item key={item.value} item={item}>
                  <Toc.Link
                    href={`#${item.value}`}
                    onClick={() => {
                      clickedRef.current = item.value
                      setCurrent(item.value)
                      releaseClickedSoon()
                    }}
                    data-current={current === item.value ? '' : undefined} aria-current={current === item.value ? 'location' : undefined}>
                    {item.label}
                  </Toc.Link>
                </Toc.Item>
              ))}
            </Toc.List>
          </Toc.Nav>
          <Toc.Content className={css({ maxW: '5xl', mx: 'auto', px: { base: '4', '@preview/xl': '6' }, py: '10', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '16' })}>
            <PlanSection />
            <StaysSection />
            <ItinerarySection />
            <BudgetSection />
            <PackingSection />
            <PreferencesSection />
            <PhotoCredits />
          </Toc.Content>
        </Toc.Root>
      </div>
    </CurrencyContext.Provider>
  )
}
