#!/usr/bin/env node
require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || '.env' })
const { PrismaClient } = require('@prisma/client')
;(async () => {
  const prisma = new PrismaClient()
  try {
    const cm = await prisma.contactMessage.count()
    const p = await prisma.product.count()
    console.log('contactMessage count:', cm)
    console.log('product count:', p)
    await prisma.$disconnect()
    process.exit(0)
  } catch (e) {
    console.error('prisma error:', e && e.message ? e.message : e)
    try { await prisma.$disconnect() } catch {}
    process.exit(2)
  }
})()
