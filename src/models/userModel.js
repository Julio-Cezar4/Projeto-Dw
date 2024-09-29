import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UserModel = {
    findAll: async () => {
        try {
            return await prisma.user.findMany();
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw new Error('Erro ao buscar usuários');
        }
    },

    findById: async (id) => {
        try {
            return await prisma.user.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error(`Erro ao buscar usuário com ID ${id}:`, error);
            throw new Error('Erro ao buscar usuário');
        }
    },

    createUser: async (data) => {
        try {
            return await prisma.user.create({
                data,
            });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw new Error('Erro ao criar usuário');
        }
    },

    updateUser: async (id, data) => {
        try {
            return await prisma.user.update({
                where: { id },
                data,
            });
        } catch (error) {
            console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
            throw new Error('Erro ao atualizar usuário');
        }
    },

    deleteUser: async (id) => {
        try {
            return await prisma.user.delete({
                where: { id },
            });
        } catch (error) {
            console.error(`Erro ao deletar usuário com ID ${id}:`, error);
            throw new Error('Erro ao deletar usuário');
        }
    },

    findByEmail: async (email) => {
        try {
            return await prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            console.error(`Erro ao buscar usuário com email ${email}:`, error);
            throw new Error('Erro ao buscar usuário');
        }
    },
};

export default UserModel;
