// Overrides of preset-base conditions.
const stateConditions = {
  // Only explicit invalid state, not the native :invalid, which matches every empty
  // required field on page load.
  invalid: '&:is([data-invalid], [aria-invalid=true])',
}

// Theme conditions are the escape hatch for behavior a token can't express.
// Budget: at most five. Exceeding it means the contract is missing a token.
const themeConditions = {
  themeSketch: '[data-panda-theme=sketch] &',
  themePanda: '[data-panda-theme=panda] &',
}

export const conditions = { ...stateConditions, ...themeConditions } satisfies Record<string, string>
