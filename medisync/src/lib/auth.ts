import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

export function authenticate(request: Request) {
    const authHeader = headers().get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
        return null;
    }
}