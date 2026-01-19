export type Gender = 'male' | 'female' | 'unisex';

export type Product = {
  id: string;
  title: string;
  productCode: string; // 'Ürün kodu' field
  i18nTitle?: Record<string, string>;
  color?: string;
  image?: string;
  gender?: Gender; // male/female/unisex
  category?: string; // category id like 'ic-giyim', 'ev-giyim'
  images?: string[]; // optional gallery images
};

export const products: Product[] = [
  {
    id: 'p1',
    title: 'Pamuklu Slip Külot',
    i18nTitle: { TR: 'Pamuklu Slip Külot', EN: 'Cotton Brief', FR: 'Slip en coton', AR: 'سروال داخلي قطني', RU: 'Хлопковые трусы' },
    productCode: '3089',
    color: 'bg-pink-100',
    gender: 'female',
    category: 'ic-giyim',
    // test gallery order requested: deneme2, deneme3, deneme1
    image: '/photos/deneme2.png',
    images: ['/photos/deneme2.png', '/photos/deneme3.jpg', '/photos/deneme1.jpg'],
  },
  { id: 'p2', title: 'Rahat Seamless Atlet', i18nTitle: { TR: 'Rahat Seamless Atlet', EN: 'Comfort Seamless Tank', FR: 'Débardeur sans couture confortable', AR: 'قميص داخلي مريح بدون درز', RU: 'Комфортная бесшовная майка' }, productCode: '3090', color: 'bg-yellow-100', gender: 'female', category: 'ic-giyim' },
  { id: 'p3', title: 'Modal Boxer', i18nTitle: { TR: 'Modal Boxer', EN: 'Modal Boxer', FR: 'Boxer en modal', AR: 'بوكسر مودال', RU: 'Боксер из модала' }, productCode: '3091', color: 'bg-blue-100', gender: 'male', category: 'ic-giyim' },
  { id: 'p4', title: 'Dantelli Bralet', i18nTitle: { TR: 'Dantelli Bralet', EN: 'Lace Bralette', FR: 'Bralette en dentelle', AR: 'براليت دانتيل', RU: 'Кружевной бралет' }, productCode: '3092', color: 'bg-purple-100', gender: 'female', category: 'ic-giyim' },
  { id: 'p5', title: 'Termal Pijama Takımı', i18nTitle: { TR: 'Termal Pijama Takımı', EN: 'Thermal Pajama Set', FR: 'Ensemble pyjama thermique', AR: 'طقم بيجامة حرارية', RU: 'Термальный комплект для сна' }, productCode: '3093', color: 'bg-green-100', gender: 'unisex', category: 'ev-giyim' },
  { id: 'p6', title: 'Pamuklu Çorap 3lü', i18nTitle: { TR: 'Pamuklu Çorap 3lü', EN: 'Cotton Socks 3-pack', FR: 'Lot de 3 chaussettes en coton', AR: 'جوارب قطنية 3 قطع', RU: 'Набор из 3 хлопковых носков' }, productCode: '3094', color: 'bg-orange-100', gender: 'unisex', category: 'corap' },
  { id: 'p7', title: 'Seamless Boxer', i18nTitle: { TR: 'Seamless Boxer', EN: 'Seamless Boxer', FR: 'Boxer sans couture', AR: 'بوكسر بدون درز', RU: 'Бесшовный боксер' }, productCode: '3095', color: 'bg-teal-100', gender: 'male', category: 'ic-giyim' },
  { id: 'p8', title: 'Bambu Atlet', i18nTitle: { TR: 'Bambu Atlet', EN: 'Bamboo Tank', FR: 'Débardeur en bambou', AR: 'قميص داخلي من الخيزران', RU: 'Майка из бамбука' }, productCode: '3096', color: 'bg-gray-100', gender: 'male', category: 'ic-giyim' },
];
