import { PrismaClient } from '@prisma/client'
import { empty } from '@prisma/client/runtime/library'


const prisma = new PrismaClient()
 

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const ID = body.ID
    const Objekt = body.Objekt
    const Name = body.Name
    const EMail = body.EMail
    const Telefon = body.Telefon
    const Firma = body.Firma 
    const Typ = body.Typ
    const Modell = body.Modell

    const queryresult = await prisma.$queryRaw`
    INSERT INTO  Anlage (ID, Objekt, Name, EMail, Telefon, Firma, Typ, Modell)
    VALUES (${ID}, ${Objekt}, ${Name}, ${EMail}, ${Telefon}, ${Firma}, ${Typ}, ${Modell} )
    ON DUPLICATE KEY UPDATE
    Objekt = VALUES(Objekt),
    Name = VALUES(Name),
    EMail = VALUES(EMail),
    Telefon = VALUES(Telefon),
    Firma = VALUES(Firma),
    Typ = VALUES(Typ),
    Modell = VALUES(Modell);
    ;`;

  return {
    queryresult
    //    hello
//: 'world'
  }
})