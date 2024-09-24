import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const url = '/:action'
const port = 40000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC = path.join(__dirname, '../public/front/');
const USERS_FILE_PATH = path.join(__dirname, '../src/database/seeders.json'); 

// USERS_FILE_PATH
app.use(cors()); // Isso permite todas as origens
app.use(express.static(path.join(__dirname, '../public/front/')));
app.use(morgan('tiny'))
app.use(express.json());


app.get('/data/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users); 
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});
app.get('/data/macs', async (req,res) => {
    try{ 
        const macs = await prisma.mac.findMany();
        res.json(macs);
    }catch (error){
        res.status(500).json({error: "Macs Not Found"})
    }
});

app.get('/data/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    

    try {
        //findUnique busca pelo ID
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        
       if (user) {
            res.json(user);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (err) {
        console.error('Erro ao buscar o usuário:', err);
        res.status(500).send('Erro interno do servidor');
    }
});


app.get(url, (req, res) => {
    const { action } = req.params;

    switch(action){
        case "login":
            res.sendFile(`${PUBLIC}html/login.html`);
            break;
        case "cadastro":
            res.sendFile(`${PUBLIC}html/cadastro.html`)
            break;
        case "sobre":
            res.sendFile(`${PUBLIC}html/sobre.html`)
            break;
        case "contato":
            res.sendFile(`${PUBLIC}html/contato.html`)
            break;
        case "home":
            res.sendFile(`${PUBLIC}html/index.html`)
            break;
        default:
            res.status(404).send('Página não encontrada');
                break;         
    }
})



app.post('/data/users', async (req, res) => {
    const { nome, email, senha } = req.body; // Desestruturando o novo usuário

    console.log('Novo usuário:', req.body); // Logando os dados do novo usuário

    try {
        const newUser = await prisma.user.create({
            data: {
                nome,
                email,
                senha,
            }
        });

        res.status(201).json(newUser); // Retorna o novo usuário como resposta
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send('Erro interno do servidor');
    }
});


app.listen(port, () => {
    console.log('Servidor rodando na porta:', port);
});

