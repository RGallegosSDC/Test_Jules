import { PrismaClient } from '@prisma/client';

// This setup prevents creating too many Prisma Client instances in development
// due to Next.js hot-reloading.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;