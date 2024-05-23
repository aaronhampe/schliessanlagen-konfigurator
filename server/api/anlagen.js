// server/api/anlagen.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
  try {
    
    const anlagen = await prisma.anlage.findMany();
    res.status(200).json({ anlagen });
  } catch (error) {
    console.error('Error fetching anlagen:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
