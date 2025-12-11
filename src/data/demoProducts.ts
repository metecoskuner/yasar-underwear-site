export type Product = {
  id: string;
  title: string;
  productCode: string; // 'Ürün kodu' field
  color?: string;
  image?: string;
};

export const products: Product[] = [
  { id: 'p1', title: 'Pamuklu Slip Külot', productCode: '3089', color: 'bg-pink-100' },
  { id: 'p2', title: 'Rahat Seamless Atlet', productCode: '3090', color: 'bg-yellow-100' },
  { id: 'p3', title: 'Modal Boxer', productCode: '3091', color: 'bg-blue-100' },
  { id: 'p4', title: 'Dantelli Bralet', productCode: '3092', color: 'bg-purple-100' },
  { id: 'p5', title: 'Termal Pijama Takımı', productCode: '3093', color: 'bg-green-100' },
  { id: 'p6', title: 'Pamuklu Çorap 3lü', productCode: '3094', color: 'bg-orange-100' },
  { id: 'p7', title: 'Seamless Boxer', productCode: '3095', color: 'bg-teal-100' },
  { id: 'p8', title: 'Bambu Atlet', productCode: '3096', color: 'bg-gray-100' },
];
