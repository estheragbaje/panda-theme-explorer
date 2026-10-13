import type { ThemeId } from '../registry'
import { everyday } from './everyday'
import { blueprint } from './blueprint'
import { panda } from './panda'
import { pixel } from './pixel'
import { riso } from './riso'
import { sketch } from './sketch'

export { everyday }

// Keyed by the registry, so adding a registry entry without a theme (or the reverse)
// is a type error.
export const themes = { everyday, sketch, riso, blueprint, pixel, panda } satisfies Record<ThemeId, unknown>
