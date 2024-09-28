import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UserModel = {
    findAll: async () => {
        return await prisma.user.findMany();
    },

    findById: async (id) => {
        return await prisma.user.findUnique({
            where: { id },
        });
    },

    createUser: async (data) => {
        return await prisma.user.create({
            data,
        });
    },

    updateUser: async (id, data) => {
        return await prisma.user.update({
            where: { id },
            data,
        });
    },

    deleteUser: async (id) => {
        return await prisma.user.delete({
            where: { id },
        });
    },

    findByEmail: async (email) => {
        return await prisma.user.findUnique({
            where: { email },
        });
    },
};

export default UserModel;
