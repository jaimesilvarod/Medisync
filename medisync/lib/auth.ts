import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

export function authenticate(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'No autorizado' });
        return false;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        return true;
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
        return false;
    }
}