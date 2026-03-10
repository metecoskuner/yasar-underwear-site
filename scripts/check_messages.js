/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
;(async () => {
  const prisma = new PrismaClient();
  try {
    const msgs = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    console.log('DB messages count:', msgs.length);
    console.log(JSON.stringify(msgs.slice(0, 20), null, 2));
  } catch (e) {
    console.error('Error querying DB:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
