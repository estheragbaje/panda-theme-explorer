import type { Metadata } from 'next'
import { QaMatrix } from './qa-matrix'

// Hidden state matrix for visual tests. Not linked from the app.
export const metadata: Metadata = {
  title: 'QA · Theme Explorer',
  robots: { index: false, follow: false },
}

export default function QaPage() {
  return <QaMatrix />
}
