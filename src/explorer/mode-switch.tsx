'use client'

import { Switch } from '@ark-ui/react/switch'
import { useRef } from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'
import { css, cx } from '../../styled-system/css'
import { switchRecipe } from '../../styled-system/recipes'
import { toggleMode, useIsDark } from './mode'

export function ModeSwitch() {
  const isDark = useIsDark()
  const controlRef = useRef<HTMLSpanElement>(null)
  const classes = switchRecipe({ size: 'md' })

  return (
    <Switch.Root
      className={classes.root}
      checked={isDark}
      onCheckedChange={() => toggleMode(controlRef.current)}
      title="Dark mode (D)"
      data-mode-switch=""
    >
      <Switch.Control ref={controlRef} className={classes.control}>
        <Switch.Thumb className={classes.thumb}>{isDark ? <LuMoon aria-hidden /> : <LuSun aria-hidden />}</Switch.Thumb>
      </Switch.Control>
      {/* The icon carries the meaning visually; the label stays for screen readers. */}
      <Switch.Label className={cx(classes.label, css({ srOnly: true }))}>Dark mode</Switch.Label>
      {/* Ark renders a plain checkbox; role="switch" makes screen readers announce a switch. */}
      <Switch.HiddenInput role="switch" />
    </Switch.Root>
  )
}
