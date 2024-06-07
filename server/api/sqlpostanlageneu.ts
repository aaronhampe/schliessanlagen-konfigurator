import { PrismaClient } from '@prisma/client'
import { empty } from '@prisma/client/runtime/library'


const prisma = new PrismaClient()
 

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const ID = body.ID
    const Objekt = body.Objekt
    const Name = body.Name
    const EMail = body.EMail
    const Firma = body.Firma 

    const queryresult = await prisma.$queryRaw`
    INSERT INTO  Anlage (ID, Objekt, Name, EMail, Firma)
    VALUES (${ID}, ${Objekt}, ${Name}, ${EMail}, ${Firma} )
    ON DUPLICATE KEY UPDATE
    Objekt = VALUES(Objekt),
    Name = VALUES(Name),
    EMail = VALUES(EMail),
    Firma = VALUES(Firma);
    ;`;

  return {
    queryresult
    //    hello
//: 'world'
  }
})