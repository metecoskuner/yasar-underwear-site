export type Location = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  isCenter?: boolean;
  offsetX?: number;
  offsetY?: number;
  // Optional per-location mobile offsets (applied only on narrow viewports)
  mobileOffsetX?: number;
  mobileOffsetY?: number;
  // Optional per-location tablet offsets (applied on intermediate viewports)
  tabletOffsetX?: number;
  tabletOffsetY?: number;
  // Optional per-location desktop offsets (for large screens / 4k)
  desktopOffsetX?: number;
  desktopOffsetY?: number;
  // Optional label offsets for each breakpoint
  mobileLabelOffsetX?: number;
  mobileLabelOffsetY?: number;
  tabletLabelOffsetX?: number;
  tabletLabelOffsetY?: number;
  desktopLabelOffsetX?: number;
  desktopLabelOffsetY?: number;
};

const LOCATIONS: Location[] = [
  {
    id: 'tr',
    name: 'Турция',
    lat: 37.08162870861236,
    lon: 34.87085251581098,
    isCenter: true,
    offsetX: -18.926459842258026,
    offsetY: 8.115198528955853,
    tabletOffsetY: -23,
    mobileOffsetY: -30,
    mobileOffsetX: -28,
    tabletOffsetX: -8,
    desktopOffsetX: 0,
    desktopOffsetY: -15,
    mobileLabelOffsetX: -21,
    mobileLabelOffsetY: -3,
    tabletLabelOffsetX: -19,
    tabletLabelOffsetY: -3,
    desktopLabelOffsetX: -19,
    desktopLabelOffsetY: -2,
  },
  {
    id: 'uk',
    name: 'Великобритания',
    lat: 55.3781,
    lon: -3.436,
    offsetX: -3.148766896081349,
    offsetY: 10.946478949652779,
    tabletOffsetY: -12,
    mobileOffsetY: -17,
    mobileOffsetX: -27,
    tabletOffsetX: -12,
    mobileLabelOffsetX: -3,
    mobileLabelOffsetY: 12,
    tabletLabelOffsetX: -5,
    tabletLabelOffsetY: 12,
  },
  {
    id: 'de',
    name: 'Германия',
    lat: 51.1657,
    lon: 10.4515,
    offsetX: -15.960675920758927,
    offsetY: 7.167337084573413,
    tabletOffsetY: -14,
    mobileOffsetY: 1,
    mobileOffsetX: 14,
    tabletOffsetX: -13,
    desktopOffsetX: 2,
    desktopOffsetY: 3,
    mobileLabelOffsetX: -17,
    mobileLabelOffsetY: 10,
    tabletLabelOffsetX: -19,
    tabletLabelOffsetY: 7,
    desktopLabelOffsetX: -16,
    desktopLabelOffsetY: 17,
  },
  {
    id: 'ro',
    name: 'Румыния',
    lat: 45.9432,
    lon: 24.9668,
    offsetX: -22.052565801711307,
    offsetY: 7.071860661582341,
    tabletOffsetY: -9,
    mobileOffsetY: -37,
    mobileOffsetX: -76,
    tabletOffsetX: -11,
    desktopOffsetX: 0,
    desktopOffsetY: -8,
    mobileLabelOffsetX: -29,
    mobileLabelOffsetY: 15,
    tabletLabelOffsetX: -25,
    tabletLabelOffsetY: 12,
  },
  {
    id: 'kw',
    name: 'Кувейт',
    lat: 29.3759,
    lon: 47.9774,
    offsetX: -20.144345238095234,
    offsetY: 8.203869047619047,
    tabletOffsetY: -14,
    mobileOffsetY: -19,
    mobileOffsetX: -31,
    tabletOffsetX: -14,
    mobileLabelOffsetX: -20,
    mobileLabelOffsetY: 12,
    tabletLabelOffsetX: -21,
    tabletLabelOffsetY: 8,
    desktopLabelOffsetX: -20,
    desktopLabelOffsetY: 15,
  },
  {
    id: 'ly',
    name: 'Ливия',
    lat: 26.3351,
    lon: 17.2283,
    offsetX: -14.683216155521453,
    offsetY: 6.966936429341629,
    tabletOffsetY: -17,
    mobileOffsetY: -26,
    mobileOffsetX: -26,
    tabletOffsetX: -9,
    desktopOffsetX: 0,
    desktopOffsetY: -10,
    mobileLabelOffsetX: -15,
    mobileLabelOffsetY: 6,
  },
  {
    id: 'nl',
    name: 'Нидерланды',
    lat: 52.1326,
    lon: 5.2913,
    offsetX: -19.541470966641864,
    offsetY: -18.733148484002974,
    tabletOffsetY: -15,
    mobileOffsetY: -21,
    mobileOffsetX: -29,
    tabletOffsetX: -11,
    desktopOffsetX: 1,
    desktopOffsetY: -9,
    tabletLabelOffsetX: -18,
    tabletLabelOffsetY: -20,
    desktopLabelOffsetX: -21,
    desktopLabelOffsetY: -19,
  },
  {
    id: 'fr',
    name: 'Франция',
    lat: 46.2276,
    lon: 2.2137,
    offsetX: -20.570089673239085,
    offsetY: 5.953512524801587,
    tabletOffsetY: -12,
    mobileOffsetY: -20,
    mobileOffsetX: -30,
    tabletOffsetX: -13,
    mobileLabelOffsetX: -20,
    mobileLabelOffsetY: 7,
    desktopLabelOffsetX: -21,
    desktopLabelOffsetY: 15,
  },
  {
    id: 'us',
    name: 'США',
    lat: 37.0902,
    lon: -95.7129,
    offsetX: -10.423842657180058,
    offsetY: 9.902584015376984,
    tabletOffsetY: 8,
    mobileOffsetY: -25,
    mobileOffsetX: -29,
    desktopOffsetX: 2,
    desktopOffsetY: -10,
  },
];

export default LOCATIONS;
