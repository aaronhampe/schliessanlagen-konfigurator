import { PrismaClient } from '@prisma/client';
import { empty } from '@prisma/client/runtime/library';
// import { defineEventHandler } from 'some-framework'; // Ersetzen Sie 'some-framework' durch den tatsächlichen Importpfad

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event); // Stellen Sie sicher, dass getQuery korrekt implementiert ist
  const id: string = query.ID;
  var body = [{}];

  body = await readBody(event); // Stellen Sie sicher, dass readBody korrekt implementiert ist

  async function deleteData() {
    const result = await prisma.$queryRaw`DELETE FROM Schluessel WHERE id = ${id};`;
    
  }

  async function insertData() {
    const insertQueries = body.map(item => {
      return prisma.$queryRaw`INSERT INTO Schluessel (ID, KeyPOS, Bezeichnung, Anzahl) 
                               VALUES (${id}, ${item.keyPos}, ${item.keyname}, ${item.keyquantity}) 
                               ON DUPLICATE KEY UPDATE 
                               KeyPOS = ${item.keyPos},
                               Bezeichnung =  ${item.keyname},
                               Anzahl = ${item.keyquantity};`;
    });

    await Promise.all(insertQueries);
  }

  try {
    await deleteData();
    await insertData();
    return { message: 'Daten gelöscht und eingefügt.' }; // Rückgabewert für den EventHandler
  } catch (e) {
    console.error(e);
    return { error: 'Ein Fehler ist aufgetreten.' }; // Rückgabewert für den EventHandler bei Fehlern
  } finally {
    await prisma.$disconnect(); // Stellen Sie sicher, dass prisma richtig getrennt wird
  }
});
