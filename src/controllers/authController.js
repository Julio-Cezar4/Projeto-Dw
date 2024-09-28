import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Importa bcrypt para hash de senha
import { prisma } from '../prismaClient.js';

// Função de login
export const login = async (req, res) => {
    const { email, senha } = req.body;

    // Validação do input
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        // Busca o usuário pelo email
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        // Verifica se o usuário existe e se a senha está correta
        if (!user || !await bcrypt.compare(senha, user.senha)) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id }, // payload com o ID do usuário
            process.env.JWT_SECRET, // chave secreta
            { expiresIn: '1h' } // expiração do token
        );

        // Retorna o token
        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Função para registro de usuários (opcional, se não estiver implementada ainda)
export const register = async (req, res) => {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        // Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        // Hash da senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(senha, 10); // 10 é o número de rounds de salt

        // Cria o novo usuário no banco de dados
        const newUser = await prisma.user.create({
            data: {
                email: email,
                senha: hashedPassword, // salva a senha já hasheada
            },
        });

        // Retorna sucesso e dados do usuário
        res.status(201).json({ message: 'Usuário criado com sucesso', userId: newUser.id });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

