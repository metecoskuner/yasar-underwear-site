const { PrismaClient } = require('@prisma/client');
;(async () => {
  const p = new PrismaClient();
  try {
    const q = await p.quoteRequest.findMany({ orderBy: { createdAt: 'desc' } });
    console.log('quotes:', q.length);
    console.log(JSON.stringify(q.slice(0, 10), null, 2));
  } catch (e) {
    console.error('error querying quotes', e);
    process.exitCode = 1;
  } finally {
    await p.$disconnect();
  }
})();
