// Simple list of locations to show on the world map
// Coordinates are in decimal degrees (lat, lon)
// This list contains the countries you asked to mark (cities used for placement).
const LOCATIONS = [
  { id: 'uk-london', name: 'London, UK', lat: 51.5074, lon: -0.1278, desc: 'United Kingdom' },
  { id: 'de-berlin', name: 'Berlin, DE', lat: 52.52, lon: 13.405, desc: 'Germany' },
  // Turkey marked as the centre (different style)
  { id: 'tr-ankara', name: 'Ankara, TR', lat: 39.9334, lon: 32.8597, desc: 'Turkey (center)', isCenter: true },
  { id: 'ro-bucharest', name: 'Bucharest, RO', lat: 44.4268, lon: 26.1025, desc: 'Romania' },
  { id: 'kw-kuwait', name: 'Kuwait City, KW', lat: 29.3759, lon: 47.9774, desc: 'Kuwait' },
  { id: 'ly-tripoli', name: 'Tripoli, LY', lat: 32.8872, lon: 13.1913, desc: 'Libya' },
  { id: 'nl-amsterdam', name: 'Amsterdam, NL', lat: 52.3676, lon: 4.9041, desc: 'Netherlands' },
  { id: 'fr-paris', name: 'Paris, FR', lat: 48.8566, lon: 2.3522, desc: 'France' },
  { id: 'us-nyc', name: 'New York, USA', lat: 40.7128, lon: -74.006, desc: 'United States' },
];

export type LocationItem = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  desc?: string;
};

export default LOCATIONS;
