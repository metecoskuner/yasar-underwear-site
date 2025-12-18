// locations.ts
export type LocationItem = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  desc?: string;
  offsetX?: number;
  offsetY?: number;
  isCenter?: boolean;
};

const LOCATIONS: LocationItem[] = [
  {
    id: 'uk',
    name: 'United Kingdom',
    lat: 55.3781,
    lon: -3.4360,
    desc: 'United Kingdom',
  },
  {
    id: 'de',
    name: 'Germany',
    lat: 51.1657,
    lon: 10.4515,
    desc: 'Germany',
  },
  {
    id: 'tr',
    name: 'Turkey',
    lat: 39.0,
    lon: 35.0,
    desc: 'Turkey',
    isCenter: true,
  },
  {
    id: 'ro',
    name: 'Romania',
    lat: 45.9432,
    lon: 24.9668,
    desc: 'Romania',
  },
  {
    id: 'kw',
    name: 'Kuwait',
    lat: 29.3117,
    lon: 47.4818,
    desc: 'Kuwait',
  },
  {
    id: 'ly',
    name: 'Libya',
    lat: 26.3351,
    lon: 17.2283,
    desc: 'Libya',
  },
  {
    id: 'nl',
    name: 'Netherlands',
    lat: 52.1326,
    lon: 5.2913,
    desc: 'Netherlands',
  },
  {
    id: 'fr',
    name: 'France',
    lat: 46.2276,
    lon: 2.2137,
    desc: 'France',
  },
  {
    id: 'us',
    name: 'United States',
    lat: 37.0902,
    lon: -95.7129,
    desc: 'United States',
  },
];

export default LOCATIONS;