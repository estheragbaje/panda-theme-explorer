// Type-level test, run by `pnpm typecheck`. It fails the build if the contract stops
// rejecting incomplete themes. Never imported at runtime.
import { defineTheme } from '../contract'
import { everyday } from '../themes/everyday'

// A complete theme compiles (the real Everyday theme is the positive case).
everyday satisfies object

// @ts-expect-error a theme that leaves out contract tokens must not compile
defineTheme({ semanticTokens: { radii: { control: { value: '4px' } } } })
