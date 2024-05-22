// test-prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const anlagen = await prisma.anlage.findMany();
    console.log(anlagen);
  } catch (error) {
    console.error('Error fetching anlagen:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();