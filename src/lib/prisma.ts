import { PrismaClient } from '@prisma/client';

declare global {
  // allow global in dev to preserve client across HMR
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.__prisma = prisma;
