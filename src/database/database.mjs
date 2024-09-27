import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();

async function main() {
  const data = await fs.readFile('./seeders.json', 'utf-8');
  const users = JSON.parse(data).users;
  const macs = JSON.parse(data).macs;

  for (const user of users) {
    try {
      await prisma.user.create({
        data: {
          nome: user.nome,
          email: user.email,
          senha: user.senha,
          histories: {
            create: user.history && user.history.length > 0 ? 
              user.history.map(hist => ({
                entry: hist.entry, 
              })) : [],
          },
        },
      });
      console.log(`Usuário ${user.nome} criado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao criar usuário ${user.nome}:`, error);
    }
  }

  for (const mac of macs) {
    try {
      await prisma.mac.create({
        data: {
          nome: mac.mac,
          fabricante: mac.fabricante,
        },
      });
      console.log(`MAC ${mac.mac} criado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao criar MAC ${mac.mac}:`, error);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
