import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany();
  return Response.json(products);
}
