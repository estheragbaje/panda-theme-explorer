import { MODE_STORAGE_KEY, THEME_IDS, THEME_STORAGE_KEY } from '../../theme/registry'

// Inlined in <head> and run while the HTML is parsed, before first paint, so a
// returning dark-mode visitor never sees a light frame. With no stored choice it does
// nothing, and light renders straight from the server HTML. The OS preference is
// ignored on purpose: the first visit is always light.
//
// Order: ?mode= / ?theme= in the URL, then the stored choice. Themes must be known ids.
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
  } catch (e) {}
})()`
