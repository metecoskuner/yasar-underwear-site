/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Clearing site content.products...');
    const entry = await prisma.siteContent.findUnique({ where: { key: 'site' } });
    if (!entry) {
      console.log('No site content found, creating empty content.');
      await prisma.siteContent.create({ data: { key: 'site', value: JSON.stringify({ products: [] }) } });
      console.log('Created site content with empty products.');
    } else {
      let content = {};
      try { content = typeof entry.value === 'string' ? JSON.parse(entry.value) : entry.value; } catch { content = {}; }
      content.products = [];
      await prisma.siteContent.update({ where: { key: 'site' }, data: { value: JSON.stringify(content) } });
      console.log('siteContent updated: products cleared.');
    }
  } catch (err) {
    console.error('Failed to clear site content:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
