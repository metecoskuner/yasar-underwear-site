// Seed sample products into localStorage so you can test admin + main site behavior.
// Usage: open the browser console on your dev site and paste the contents or run:
//   fetch('/scripts/seed-local-products.js').then(r=>r.text()).then(eval)

(function seed() {
  const sample = [
    {
      id: 'demo-' + Date.now(),
      title: 'Demo Ürün A',
      productCode: 'DEM-A-01',
      image: '/photos/deneme2.png',
      images: ['/photos/deneme2.png'],
      price: 99,
      description: 'Kısa demo açıklaması A',
      sizes: ['S', 'M', 'L'],
      stock: 12,
      category: 'ic-giyim',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-' + (Date.now() + 1),
      title: 'Demo Ürün B',
      productCode: 'DEM-B-02',
      image: '/photos/deneme3.jpg',
      images: ['/photos/deneme3.jpg'],
      price: 129,
      description: 'Kısa demo açıklaması B',
      sizes: ['M', 'L'],
      stock: 6,
      category: 'ev-giyim',
      createdAt: new Date().toISOString(),
    }
  ];
  try {
    localStorage.setItem('yasar:products', JSON.stringify(sample));
    console.log('Seeded sample products to localStorage (key: yasar:products)')
  } catch (err) {
    console.error('Failed to seed local products', err)
  }
})();
