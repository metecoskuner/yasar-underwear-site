require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || '.env' })
const { PrismaClient } = require('@prisma/client')
;(async () => {
  const prisma = new PrismaClient()
  try {
    const data = {
      title: JSON.stringify({ tr: 'Test Ürün', en: 'Test Product', fr: '', ar: '', ru: '' }),
      description: 'Test product created by script',
      productCode: 'TEST-001',
      gender: '',
      images: JSON.stringify(['/photos/test.jpg']),
      stock: 10,
      isActive: true,
      isFeatured: false,
    }
    const created = await prisma.product.create({ data })
    console.log('created:', created)
    await prisma.$disconnect()
    process.exit(0)
  } catch (e) {
    console.error('create error:', e && e.message ? e.message : e)
    try { await prisma.$disconnect() } catch {}
    process.exit(2)
  }
})()
