/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
;(async () => {
  const prisma = new PrismaClient()
  try {
    console.log('DB URL (masked):', (process.env.DATABASE_URL || '(none)').slice(0, 20) + '...')
    const created = await prisma.product.create({ data: {
      title: JSON.stringify({ tr: 'Script Ürün Testi', en: '' }),
      description: 'Created by debug script',
      productCode: 'SCRIPT-TEST-001',
      gender: '',
      images: JSON.stringify([]),
      stock: 1,
      isActive: true,
      isFeatured: false,
    } })
    console.log('Created product id=', created.id)
    const all = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    console.log('Total products in DB:', all.length)
    console.log('First product:', all[0])
  } catch (err) {
    console.error('script error', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
