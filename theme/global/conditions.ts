// Theme conditions are the escape hatch for behavior a token can't express.
// Budget: at most five. Exceeding it means the contract is missing a token.
export const themeConditions = {
  themeSketch: '[data-panda-theme=sketch] &',
  themePanda: '[data-panda-theme=panda] &',
} satisfies Record<string, string>
