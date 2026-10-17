// Overrides of preset-base conditions.
const stateConditions = {
  // Only explicit invalid state, not the native :invalid, which matches every empty
  // required field on page load.
  invalid: '&:is([data-invalid], [aria-invalid=true])',
}

// Theme conditions are the escape hatch for behavior a token can't express.
// Budget: at most five. Exceeding it means the contract is missing a token.
//
// Each is scoped to the nearest theme: it applies inside an element of that theme and
// stops at any element of another theme. A plain "[data-panda-theme=y2k] &" also matched
// the explorer's chrome, which wears Everyday inside a page whose root wears the chosen
// theme. Tokens don't need this (CSS variables already resolve to the nearest theme).
const themeScope = (id: string) => `@scope ([data-panda-theme=${id}]) to ([data-panda-theme]:not([data-panda-theme=${id}]))`
const themeConditions = {
  themeSketch: themeScope('sketch'),
  themeY2k: themeScope('y2k'),
}

export const conditions = { ...stateConditions, ...themeConditions } satisfies Record<string, string>
