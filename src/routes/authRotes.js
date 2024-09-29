import express from 'express';
import { login } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getUsers } from '../controllers/userController.js'; // Importa o controller para buscar usuários

const router = express.Router();

router.post('/login', login);

// Rota para buscar usuários
router.get('/users', authenticateToken, getUsers); // Usa o controller para buscar usuários

export default router;
