declare module 'd3-geo';
declare module 'topojson-client';
declare module 'world-atlas/countries-110m.json';

// Minimal JSX namespace so files using JSX.Element type don't error if @types/react is mismatched.
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
