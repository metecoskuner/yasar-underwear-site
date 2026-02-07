/* Lightweight Leaflet loader hook utilities
   - Exposes loadLeaflet() which ensures Leaflet CSS/JS are injected
   - Returns the global `L` object once available
*/
export async function loadLeaflet(): Promise<unknown> {
  const L_CSS = process.env.NEXT_PUBLIC_LEAFLET_CSS || 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  const L_JS = process.env.NEXT_PUBLIC_LEAFLET_JS || 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

  function loadCss(href: string) {
    if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      l.onload = () => resolve();
      l.onerror = () => reject(new Error('Failed to load CSS'));
      document.head.appendChild(l);
    });
  }

  function loadScript(src: string) {
    if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load script'));
      document.body.appendChild(s);
    });
  }

  await loadCss(L_CSS);
  await loadScript(L_JS);

  // Return the global Leaflet object as unknown to avoid leaking `any` in this utility.
  return (window as unknown as { L?: unknown }).L;
}
