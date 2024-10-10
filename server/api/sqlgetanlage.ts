import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
  
    const ID = body.ID
    console.log("Received ID:", ID);
    const queryresult = await prisma.$queryRaw`
    SELECT *
    FROM Anlage
    WHERE Anlage.id = ${ID};`;

  return {
    queryresult
    //    hello
//: 'world'
  }
})