export type Product = {
  id: string;
  title: string;
  price: string;
  color?: string;
  image?: string;
};

export const products: Product[] = [
  { id: 'p1', title: 'Pamuklu Slip Külot', price: '₺149,90', color: 'bg-pink-100' },
  { id: 'p2', title: 'Rahat Seamless Atlet', price: '₺119,90', color: 'bg-yellow-100' },
  { id: 'p3', title: 'Modal Boxer', price: '₺199,90', color: 'bg-blue-100' },
  { id: 'p4', title: 'Dantelli Bralet', price: '₺249,90', color: 'bg-purple-100' },
  { id: 'p5', title: 'Termal Pijama Takımı', price: '₺399,90', color: 'bg-green-100' },
  { id: 'p6', title: 'Pamuklu Çorap 3lü', price: '₺89,90', color: 'bg-orange-100' },
];
