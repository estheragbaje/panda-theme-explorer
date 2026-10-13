import { MODE_STORAGE_KEY, THEME_IDS } from '../../theme/registry'

// Inlined in <head> and run while the HTML is parsed, before first paint, so a
// returning dark-mode visitor never sees a light frame. With no stored choice it does
// nothing, and light renders straight from the server HTML. The OS preference is
// ignored on purpose: the first visit is always light.
//
// Order: ?mode= in the URL, then the stored choice. ?theme= must be a known theme.
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
    var theme = q.get('theme');
    if (theme && ${JSON.stringify(THEME_IDS)}.indexOf(theme) !== -1) el.setAttribute('data-panda-theme', theme);
  } catch (e) {}
})()`
