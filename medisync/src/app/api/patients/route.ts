import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const patients = await prisma.patient.findMany();
    return NextResponse.json(patients);
}

export async function POST(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { name, address, contact, medicalHistory } = await request.json();
    if (!name || !address || !contact) {
        return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 });
    }
    const patient = await prisma.patient.create({
        data: { name, address, contact, medicalHistory },
    });
    return NextResponse.json(patient, { status: 201 });
}