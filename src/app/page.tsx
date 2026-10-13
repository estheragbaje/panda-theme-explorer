import { css } from '../../styled-system/css'
import { ModeSwitch } from '../explorer/mode-switch'
import { TripPage } from '../trip/trip-page'
import { Toaster } from '../ui/toast'

// Phase 4: the trip page in a full-height frame. Phase 5 replaces this frame with the
// explorer (header, theme rail, inspector), with TripPage in the canvas.
export default function Home() {
  return (
    <div className={css({ h: '[100dvh]', display: 'flex', flexDirection: 'column' })}>
      <header
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: '4',
          h: '14',
          flexShrink: '0',
          bg: 'bg.surface',
          borderBottomWidth: 'card',
          borderColor: 'border.default',
        })}
      >
        <span className={css({ textStyle: 'label' })}>Panda Themes</span>
        <ModeSwitch />
      </header>
      <main className={css({ flex: '1', minH: '0' })}>
        <TripPage />
      </main>
      <Toaster />
    </div>
  )
}
