require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || '.env' })
const { PrismaClient } = require('@prisma/client')
;(async () => {
  const prisma = new PrismaClient()
  try {
    const data = {
      name: 'Test Kullanıcı',
      email: 'test@example.com',
      phone: '+900000000000',
      message: 'Bu bir test ileti mesajıdır — admin panel testi.',
    }
    const created = await prisma.contactMessage.create({ data })
    console.log('created message id:', created.id)
    await prisma.$disconnect()
    process.exit(0)
  } catch (e) {
    console.error('create message error:', e && e.message ? e.message : e)
    try { await prisma.$disconnect() } catch {}
    process.exit(2)
  }
})()
