import { PrismaClient } from '@prisma/client'
import { empty } from '@prisma/client/runtime/library'


const prisma = new PrismaClient()
 

export default defineEventHandler(async (event) => {
    var body = [{}];
    body = await readBody(event)
 
    
  

    async function insertData() {
      //console.log(body);
      const insertQueries = body.map(item => {
        return prisma.$queryRaw`INSERT INTO Position (ID, POS, Bezeichnung, Anzahl, Typ, SizeA, SizeI, Option) 
                             VALUES (${item.ID}, ${item.POS}, ${item.Bezeichnung}, ${item.Anzahl}, ${item.Typ}, ${item.SizeA}, ${item.SizeI}, ${item.Option}) 
                             ON DUPLICATE KEY UPDATE 
                             Bezeichnung = ${item.Bezeichnung}, 
                             Anzahl = ${item.Anzahl}, 
                             Typ = ${item.Typ}, 
                             SizeA = ${item.SizeA}, 
                             SizeI = ${item.SizeI}, 
                             Option = ${item.Option}`;
  });
  console.log(insertQueries);
    
     await Promise.all(insertQueries);
    }
    insertData()
    
    /* .catch(e => {
      console.error(e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });  */

  return {
    
    //    hello
//: 'world'
  }
})