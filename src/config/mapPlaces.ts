export const MAP_PLACES = [
  {
    id: 'mahmutpasa',
    title: 'Mahmutpaşa Camii',
    lat: 41.0086,
    lng: 28.97,
    addr: 'Mahmutpaşa Camii Avlu İçi No:12/A, Fatih/İstanbul'
  },
  {
    id: 'uretim-1',
    title: 'Üretim 1',
    lat: 41.0629,
    lng: 28.8289,
    addr: 'Küçükçekmece / İstanbul'
  },
  {
    id: 'uretim-2',
    title: 'Üretim 2',
    lat: 40.2643,
    lng: 29.0612,
    addr: 'Yenişehir / Bursa'
  }
] as const;

export type MapPlace = (typeof MAP_PLACES)[number];
