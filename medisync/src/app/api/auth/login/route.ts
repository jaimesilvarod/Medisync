import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        // En producción, verifica la contraseña con bcrypt
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
        return NextResponse.json({ token });
    }
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
}