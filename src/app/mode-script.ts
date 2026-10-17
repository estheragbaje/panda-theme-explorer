import { LAYOUT_STORAGE_KEY, MODE_STORAGE_KEY, PANEL_SIZES, THEME_IDS, THEME_STORAGE_KEY } from '../../theme/registry'

// Inlined in <head> and run while the HTML is parsed, before first paint, so a
// returning dark-mode visitor never sees a light frame. With no stored choice it does
// nothing, and light renders straight from the server HTML. The OS preference is
// ignored on purpose: the first visit is always light.
//
// Order: ?mode= / ?theme= in the URL, then the stored choice. Themes must be known ids.
//
// It also sets the stored panel layout as CSS variables (--layout-rail, --layout-inspector)
// and attributes (data-layout-rail, data-layout-inspector). Until the explorer has measured
// the window, the panels are sized from these in pixels, so a reload paints them where
// they'll stay instead of at a guessed width.
export const modeScript = `(function () {
  try {
    var q = new URLSearchParams(location.search);
    var stored = null;
    try { stored = localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)}); } catch (e) {}
    var el = document.documentElement;
    if ((q.get('mode') || stored) === 'dark') {
      el.classList.add('dark');
      el.style.colorScheme = 'dark';
    }
    var storedTheme = null;
    try { storedTheme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch (e) {}
    var ids = ${JSON.stringify(THEME_IDS)};
    var theme = [q.get('theme'), storedTheme].filter(function (t) { return t && ids.indexOf(t) !== -1; })[0];
    if (theme) el.setAttribute('data-panda-theme', theme);
    var sizes = ${JSON.stringify(PANEL_SIZES)};
    var layout = null;
    try { layout = JSON.parse(localStorage.getItem(${JSON.stringify(LAYOUT_STORAGE_KEY)}) || 'null'); } catch (e) {}
    layout = layout || {};
    var clamp = function (v, s) { return typeof v === 'number' ? Math.min(s.max, Math.max(s.min, v)) : s.default; };
    var rail = layout.railCollapsed ? sizes.rail.collapsed : clamp(layout.railPx, sizes.rail);
    var inspector = layout.inspectorOpen ? clamp(layout.inspectorPx, sizes.inspector) : 0;
    // Ark's splitter keeps sizes as percentages rounded to 3 significant digits and splits
    // the space by them, so a panel lands a fraction of a pixel off its stored size. Do the
    // same sums here, so the first paint is at exactly the widths Ark will produce.
    var vw = el.clientWidth;
    if (vw >= sizes.minViewport) {
      var space = vw - 2 * sizes.inset - sizes.gutter - (inspector ? sizes.gutter : 0);
      var p3 = function (n) { return Number(n.toPrecision(3)); };
      var railPct = (rail / space) * 100;
      var inspectorPct = (inspector / space) * 100;
      var g = [p3(railPct), p3(100 - railPct - inspectorPct), p3(inspectorPct)];
      if (layout.railCollapsed) {
        // The collapsed rail is pinned to its exact size; the others share the rest.
        inspector = inspector && (g[2] / (g[1] + g[2])) * (space - rail);
      } else {
        rail = (g[0] / (g[0] + g[1] + g[2])) * space;
        inspector = (g[2] / (g[0] + g[1] + g[2])) * space;
      }
    }
    el.style.setProperty('--layout-rail', rail + 'px');
    el.style.setProperty('--layout-inspector', inspector + 'px');
    if (layout.railCollapsed) el.setAttribute('data-layout-rail', 'collapsed');
    if (layout.inspectorOpen) el.setAttribute('data-layout-inspector', 'open');
  } catch (e) {}
})()`
