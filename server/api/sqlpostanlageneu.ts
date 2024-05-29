import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const ID = body.ID

    const queryresult = await prisma.$queryRaw`
    INSERT INTO  Anlage (ID, Objekt, Name, Vorname, EMail, Firma)
    VALUES ("12346", "Hallo", "Ich", "bin", "hallo@ich.de", "Firma");`;

  return {
    queryresult
    //    hello
//: 'world'
  }
})