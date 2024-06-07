import { PrismaClient } from '@prisma/client';
import { empty } from '@prisma/client/runtime/library';
// import { defineEventHandler } from 'some-framework'; // Ersetzen Sie 'some-framework' durch den tatsächlichen Importpfad

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event); // Stellen Sie sicher, dass getQuery korrekt implementiert ist
  const id: string = query.ID;
  var body = [{}];

  body = await readBody(event); // Stellen Sie sicher, dass readBody korrekt implementiert ist

  async function anlagetest() {
    const result = await prisma.$queryRaw`Select * FROM Anlage WHERE id = ${id};`;
    console.log(result);
    return result;
  }

  try {
    const result = await anlagetest();
    if (result.length === 0) {
      return { message: 'Anlagennummer existiert nicht.' };
    } else {
      return { message: 'Anlagennummer existiert.' };
    }
  } catch (e) {
    console.error(e);
    return { error: 'Ein Fehler ist aufgetreten.' };
  } finally {
    await prisma.$disconnect(); // Stelle sicher, dass prisma richtig getrennt wird
  }
});
