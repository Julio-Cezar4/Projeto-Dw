import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { login, register } from './controllers/authController.js'; // Importando o authController
import bcrypt from 'bcrypt'; // Importando bcrypt para criptografar a senha

const prisma = new PrismaClient();
const app = express();
const url = '/:action';
const port = 40000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC = path.join(__dirname, '../public/front/');
const USERS_FILE_PATH = path.join(__dirname, '../src/database/seeders.json'); 

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // O token deve ser enviado no header Authorization como "Bearer <token>"
    if (!token) return res.sendStatus(401); // Se não há token, não está autorizado

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido
        req.user = user; // Adiciona as informações do usuário ao objeto da requisição
        next(); // Passa para o próximo middleware ou rota
    });
};

app.use(cors());
app.use(express.static(path.join(__dirname, '../public/front/')));
app.use(morgan('tiny'));
app.use(express.json());

// Rotas de autenticação
app.post('/login', login);   // Rota para login
app.post('/register', register); // Rota para registrar um novo usuário

// Rota para obter todos os usuários
app.get('/data/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users); 
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Rota para buscar todos os MACs
app.get('/data/macs', async (req, res) => {
    try { 
        const macs = await prisma.mac.findMany();
        res.json(macs);
    } catch (error) {
        res.status(500).json({ error: "Macs Not Found" });
    }
});

// Rota para obter informações de um usuário específico
app.get('/data/users/:id', async (req, res) => {
    const userId = req.params.id;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
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

// Rota para adicionar ao histórico de um usuário
app.post('/data/users/:id/history', async (req, res) => {
    const userId = req.params.id;
    const { pesquisa } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const newHistory = await prisma.history.create({
            data: {
                entry: pesquisa, 
                userId: userId
            }
        });

        res.status(200).json(newHistory);
    } catch (error) {
        console.error('Erro ao adicionar ao histórico:', error);
        res.status(500).json({ error: "Erro ao adicionar ao histórico" });
    }
});

// Rota para buscar o histórico de um usuário
app.get('/data/users/:id/history', async (req, res) => {
    const userId = req.params.id;
    try {
        const history = await prisma.history.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' } 
        });

        res.status(200).json({ history });
    } catch (error) {
        console.error('Erro ao obter o histórico do usuário:', error);
        res.status(500).json({ error: "Erro ao obter o histórico do usuário" });
    }
});

// Rota para carregar páginas estáticas
app.get(url, (req, res) => {
    const { action } = req.params;

    switch (action) {
        case "login":
            res.sendFile(${PUBLIC}html/login.html);
            break;
        case "cadastro":
            res.sendFile(${PUBLIC}html/cadastro.html);
            break;
        case "sobre":
            res.sendFile(${PUBLIC}html/sobre.html);
            break;
        case "contato":
            res.sendFile(${PUBLIC}html/contato.html);
            break;
        case "home":
            res.sendFile(${PUBLIC}html/index.html);
            break;
        default:
            res.status(404).send('Página não encontrada');
            break;         
    }
});

// Rota para criar um novo usuário
app.post('/data/users', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        const newUser = await prisma.user.create({
            data: { 
                nome, 
                email, 
                senha: hashedPassword // Armazena a senha criptografada
            },
        });

        res.status(201).json(newUser);
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send('Erro interno do servidor');
    }
});

// Inicializando o servidor
app.listen(port, () => {
    console.log('Servidor rodando na porta:', port);
});
