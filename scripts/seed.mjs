import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')
  await prisma.contactMessage.createMany({
    data: [
      { name: 'Ali Veli', email: 'ali@example.com', message: 'Merhaba, fiyat bilgisi alabilir miyim?' },
      { name: 'Ayşe', email: 'ayse@example.com', message: 'Ürün stokta mı?' },
    ],
  })

  await prisma.quoteRequest.createMany({
    data: [
      { name: 'Firma A', email: 'firmaa@example.com', company: 'Firma A', phone: '+90 555 111 2222', product: 'Ürün X', qty: 100, message: 'Numune isteği' },
      { name: 'Firma B', email: 'firmab@example.com', company: 'Firma B', phone: '+90 555 333 4444', product: 'Ürün Y', qty: 250, message: 'Fiyat teklifi rica ederiz' },
    ],
  })

  console.log('Demo data seeded')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
