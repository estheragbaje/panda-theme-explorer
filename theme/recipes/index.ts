import { badge, kbd } from './badge'
import { button } from './button'
import { alert, card, table } from './card'
import { avatar, progress } from './display'
import { checkbox, field, numberInput, radioGroup, ratingGroup, segmentGroup, slider, tagsInput, toggle } from './forms'
import { input, textarea } from './input'
import { collapsible, splitter, tabs, toc } from './navigation'
import { datePicker, dialog, drawer, select, toast, tooltip } from './overlays'
import { switchRecipe } from './switch'

export const recipes = { button, input, textarea, badge, kbd }

// Keys become the generated export names, so none may be a JavaScript reserved word
// (that is why the switch is registered as switchRecipe).
export const slotRecipes = {
  card,
  alert,
  table,
  field,
  checkbox,
  radioGroup,
  segmentGroup,
  slider,
  numberInput,
  ratingGroup,
  toggle,
  tagsInput,
  switchRecipe,
  select,
  datePicker,
  tooltip,
  dialog,
  drawer,
  toast,
  tabs,
  collapsible,
  splitter,
  toc,
  progress,
  avatar,
}
