import { PrismaClient } from '@prisma/client';

// Esta configuración evita crear demasiadas instancias de Prisma Client en desarrollo
// debido a la recarga en caliente (hot-reloading) de Next.js.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;