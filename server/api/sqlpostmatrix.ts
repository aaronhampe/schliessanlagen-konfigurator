import { PrismaClient } from '@prisma/client'
import { empty } from '@prisma/client/runtime/library'


const prisma = new PrismaClient()
 

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const id: string = query.ID;
    var body = [{}];
    
    body = await readBody(event)
 
    
  

    async function insertData() {
      //console.log(body);
      const insertQueries = body.map(item => {
        return prisma.$queryRaw`INSERT INTO Schliessplan (ID, POSZylinder, POSSchluessel, Berechtigung) 
                             VALUES (${id}, ${item.position}, ${item.keynr}, ${item.checked}) 
                             ON DUPLICATE KEY UPDATE 
                             
                             POSSchluessel = ${item.keynr}, 
                             Berechtigung = ${item.checked};
                          `;
                                    });
  
     
     await Promise.all(insertQueries);
     console.log(insertQueries);
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