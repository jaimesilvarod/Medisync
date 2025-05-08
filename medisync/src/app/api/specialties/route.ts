import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const specialties = await prisma.specialty.findMany();
    return NextResponse.json(specialties);
}

export async function POST(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { name } = await request.json();
    if (!name) {
        return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
    }
    const specialty = await prisma.specialty.create({ data: { name } });
    return NextResponse.json(specialty, { status: 201 });
}