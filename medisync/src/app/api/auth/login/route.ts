import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Correo y contraseña son requeridos' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // En producción, verifica la contraseña con bcrypt
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '1h',
        });
        return NextResponse.json({ token });
    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json({ error: 'Error Interno del Servidor' }, { status: 500 });
    }
}