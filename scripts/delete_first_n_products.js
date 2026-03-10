/* eslint-disable @typescript-eslint/no-require-imports */
// Delete the first N products ordered by createdAt DESC (most recent first).
// Usage: node scripts/delete_first_n_products.js [N]

const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const n = Number(process.argv[2]) || 3;
    console.log(`Deleting ${n} most-recent product(s)...`);
    const list = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: n });
    if (!list || list.length === 0) {
      console.log('No products found.');
      return;
    }
    for (const p of list) {
      console.log('Deleting:', p.id, p.productCode ?? '', p.title ?? '');
      await prisma.product.delete({ where: { id: p.id } });
    }
    const remaining = await prisma.product.count();
    console.log('Deleted. Remaining products in DB:', remaining);
  } catch (err) {
    console.error('Error deleting products:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
