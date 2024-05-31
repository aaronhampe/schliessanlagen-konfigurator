import { PrismaClient } from '@prisma/client'
import { empty } from '@prisma/client/runtime/library'


const prisma = new PrismaClient()
 

export default defineEventHandler(async (event) => {
    var body = [{}];
    body = await readBody(event)
 
    
  

    async function insertData() {
      const insertQueries = body.map(item => {
        return
        prisma.$queryRaw`INSERT INTO deine_tabelle_name (ID, POS, Bezeichnung, Anzahl, Typ, SizeA, SizeI, Option) VALUES (${item.ID}, ${item.POS}, ${item.Bezeichnung}, ${item.Anzahl}, ${item.Typ}, ${item.SizeA}, ${item.SizeI}, ${item.Option})`;
      });
    
      await Promise.all(insertQueries);
    }
    insertData()
    .catch(e => {
      console.error(e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    }); 

  return {
    
    //    hello
//: 'world'
  }
})