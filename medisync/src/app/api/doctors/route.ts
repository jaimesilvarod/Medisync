import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const doctors = await prisma.doctor.findMany({ include: { specialty: true } });
    return NextResponse.json(doctors);
}

export async function POST(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { name, specialtyId, contact } = await request.json();
    if (!name || !specialtyId || !contact) {
        return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 });
    }
    const doctor = await prisma.doctor.create({
        data: { name, specialtyId, contact },
    });
    return NextResponse.json(doctor, { status: 201 });
}