import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [],
});

export default prisma;
