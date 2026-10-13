// Plain recipes on native elements.
import { styled } from '../../styled-system/jsx'
import { badge, button, input, kbd, textarea } from '../../styled-system/recipes'

export const Button = styled('button', button, { defaultProps: { type: 'button' } })
export const Input = styled('input', input)
export const Textarea = styled('textarea', textarea)
export const Badge = styled('span', badge)
export const Kbd = styled('kbd', kbd)
