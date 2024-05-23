// test-prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    //const anlagen = await prisma.$queryRaw`SELECT * FROM Anlage Where id=12345;`;
    const anlagen = await prisma.anlage.findMany();

    //const anlagen2 = await prisma.$queryRaw`

    //INSERT INTO Anlage (ID, Objekt, Name, Vorname, EMail, Firma, TimeStamp)
    //VALUES (66666, 'Walsroder', , , , , ; );
    
    //`;


    console.log(anlagen);
  } catch (error) {
    console.error('Error fetching anlagen:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();