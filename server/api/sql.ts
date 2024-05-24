import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const ID = body.ID

    const queryresult = await prisma.$queryRaw`SELECT * FROM Anlage WHERE id=${ID};`;

  return {
    test: queryresult
    //    hello
//: 'world'
  }
})