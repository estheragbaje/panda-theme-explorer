import type { ThemeId } from '../registry'
import { everyday } from './everyday'

export { everyday }

// Keyed by the registry, so adding a registry entry without a theme (or the reverse)
// is a type error.
export const themes = { everyday } satisfies Record<ThemeId, unknown>
