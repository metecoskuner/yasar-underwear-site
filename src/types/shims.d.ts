declare module 'd3-geo';
declare module 'topojson-client';
declare module 'world-atlas/countries-110m.json';

// Minimal JSX namespace so files using JSX.Element type don't error if @types/react is mismatched.
declare namespace JSX {
  // Use unknown to avoid empty-interface and any lint rules while keeping a very small shim.
  type Element = unknown;
  interface IntrinsicElements {
    [elemName: string]: unknown;
  }
}
