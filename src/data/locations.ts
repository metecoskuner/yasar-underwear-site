export type Location = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  isCenter?: boolean;
  offsetX?: number;
  offsetY?: number;
};

const LOCATIONS: Location[] = [
  // place labels to the bottom-right of each pin (except Netherlands)
    // uniform small offset: labels placed close to the pin (like Germany)
    { id: 'tr', name: 'Türkiye', lat: 39.0, lon: 35.0, isCenter: true, offsetX: 4, offsetY: 4 },
    { id: 'uk', name: 'UK', lat: 55.3781, lon: -3.4360, offsetX: 4, offsetY: 4 },
    { id: 'de', name: 'Almanya', lat: 51.1657, lon: 10.4515, offsetX: 4, offsetY: 4 },
    { id: 'ro', name: 'Romanya', lat: 45.9432, lon: 24.9668, offsetX: 4, offsetY: 4 },
    { id: 'kw', name: 'Kuveyt', lat: 29.3759, lon: 47.9774, offsetX: 4, offsetY: 4 },
    { id: 'ly', name: 'Libya', lat: 26.3351, lon: 17.2283, offsetX: 4, offsetY: 4 },
    // place Netherlands label above the pin (on the pin head)
    { id: 'nl', name: 'Hollanda', lat: 52.1326, lon: 5.2913, offsetX: 0, offsetY: -18 },
    { id: 'fr', name: 'Fransa', lat: 46.2276, lon: 2.2137, offsetX: 4, offsetY: 4 },
    { id: 'us', name: 'ABD', lat: 37.0902, lon: -95.7129, offsetX: 4, offsetY: 4 },
];

export default LOCATIONS;
