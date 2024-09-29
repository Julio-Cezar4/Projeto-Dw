import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { login, register } from './controllers/authController.js'; 
import { getUsers, getUserById, createUser, addHistory, getUserHistory, getMacs } from './controllers/userController.js'; 
import { authenticateToken } from './middleware/authMiddleware.js'; 

const prisma = new PrismaClient();
const app = express();
const port = 40000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC = path.join(__dirname, '../public/front/'); 

app.use(cors());
app.use(express.static(PUBLIC));
app.use(morgan('tiny'));
app.use(express.json());

// Rotas de autenticação
app.post('/login', login);
app.post('/register', register);

// Rota para obter todos os usuários (protegida)
app.get('/data/users', authenticateToken, getUsers); 

// Rota para obter informações de um usuário específico (protegida)
app.get('/data/users/:id', authenticateToken, getUserById);

// Rota para criar um novo usuário
app.post('/data/users', createUser);

// Rota para adicionar ao histórico de um usuário (protegida)
app.post('/data/users/:id/history', authenticateToken, addHistory);

// Rota para buscar o histórico de um usuário (protegida)
app.get('/data/users/:id/history', authenticateToken, getUserHistory);

// Rota para buscar todos os MACs (protegida)
app.get('/data/macs', authenticateToken, getMacs);

// Carregando páginas estáticas
app.get('/:action', (req, res) => {
    const { action } = req.params;
    const pages = {
        login: 'html/login.html',
        cadastro: 'html/cadastro.html',
        sobre: 'html/sobre.html',
        contato: 'html/contato.html',
        home: 'html/index.html',
    };
    const filePath = pages[action];

    if (filePath) {
        res.sendFile(path.join(PUBLIC, filePath));
    } else {
        res.status(404).send('Página não encontrada');
    }
});

// Inicializando o servidor
app.listen(port, () => {
    console.log('Servidor rodando na porta:', port);
});
