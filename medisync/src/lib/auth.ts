import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function authenticate(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return decoded;
    } catch (error) {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
}