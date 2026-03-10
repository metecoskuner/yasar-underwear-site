/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

;(async () => {
  try {
    const featured = await prisma.product.findMany({ where: { isFeatured: true }, orderBy: { createdAt: 'desc' } })
    console.log(`Found ${featured.length} featured products.`)
    if (featured.length <= 4) {
      console.log('No action needed.')
      process.exit(0)
    }
    const toUnfeature = featured.slice(4)
    const ids = toUnfeature.map((p) => p.id)
    const res = await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isFeatured: false } })
    console.log(`Unfeatured ${res.count} products:`, ids)
    process.exit(0)
  } catch (err) {
    console.error('Error trimming featured products:', err)
    process.exit(1)
  } finally {
    try { await prisma.$disconnect() } catch { /* ignore */ }
  }
})()
