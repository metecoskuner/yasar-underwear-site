#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const now = await prisma.$queryRaw`SELECT NOW()`;
    console.log('OK - server time:', now[0]);
  } catch (e) {
    console.error('DB connect error:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
