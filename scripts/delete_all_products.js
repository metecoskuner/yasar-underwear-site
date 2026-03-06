// Script to delete all products from the Prisma database.
// Run from project root: node scripts/delete_all_products.js

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Deleting all products...');
    await prisma.product.deleteMany({});
    console.log('All products deleted.');
  } catch (err) {
    console.error('Failed to delete products:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
