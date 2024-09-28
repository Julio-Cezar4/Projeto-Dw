import express from 'express';
import { login } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);

router.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users); 
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

export default router;