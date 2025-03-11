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
    const protect = body.protect
    const Password = body.Password


    console.log("Speichere folgende Daten:", { ID, Objekt, Name, EMail, Telefon, Firma, Typ, Modell, protect, Password });

    const queryresult = await prisma.$queryRaw`
    INSERT INTO  Anlage (ID, Objekt, Name, EMail, Telefon, Firma, Typ, Modell, protect, Password)
    VALUES (${ID}, ${Objekt}, ${Name}, ${EMail}, ${Telefon}, ${Firma}, ${Typ}, ${Modell}, ${protect}, ${Password} )
    ON DUPLICATE KEY UPDATE
    Objekt = VALUES(Objekt),
    Name = VALUES(Name),
    EMail = VALUES(EMail),
    Telefon = VALUES(Telefon),
    Firma = VALUES(Firma),
    Typ = VALUES(Typ),
    Modell = VALUES(Modell),
    protect = VALUES(protect),
    Password = VALUES(Password);
    ;`;

  return {
    queryresult
    //    hello
//: 'world'
  }
})