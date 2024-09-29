import { prisma } from '../prismaClient.js'; // Importa a instância do Prisma

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users); 
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};
