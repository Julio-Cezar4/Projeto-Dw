import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.warn('Tentativa de acesso sem token.');
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token inválido ou expirado:', err);
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }

        req.userId = decoded.id;
        next();
    });
};
