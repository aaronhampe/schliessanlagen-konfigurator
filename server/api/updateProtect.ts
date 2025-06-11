// server/api/updateProtect.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { ID }      = await readBody(event);   // ← muss mitgeschickt werden
  if (!ID) throw createError({ statusCode: 400, statusMessage: "ID fehlt" });

  const rows = await prisma.$executeRaw`
    UPDATE Anlage
    SET protect = 1
    WHERE ID = ${String(ID).trim()};
  `;

  return { success: rows === 1, affectedRows: rows };
});
