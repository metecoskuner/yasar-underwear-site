// Simple list of locations to show on the world map
// Coordinates are in decimal degrees (lat, lon)
const LOCATIONS = [
  { id: 'tr-istanbul', name: 'Istanbul, TR', lat: 41.0082, lon: 28.9784, desc: 'Headquarters' },
  { id: 'de-berlin', name: 'Berlin, DE', lat: 52.52, lon: 13.405, desc: 'Partner / Warehouse' },
  { id: 'uk-london', name: 'London, UK', lat: 51.5074, lon: -0.1278, desc: 'Sales office' },
  { id: 'us-nyc', name: 'New York, USA', lat: 40.7128, lon: -74.006, desc: 'Distributor' },
  { id: 'cn-shanghai', name: 'Shanghai, CN', lat: 31.2304, lon: 121.4737, desc: 'Manufacturing partner' },
  { id: 'ru-moscow', name: 'Moscow, RU', lat: 55.7558, lon: 37.6173, desc: 'Regional partner' },
];

export type LocationItem = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  desc?: string;
};

export default LOCATIONS;
