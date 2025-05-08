import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const patient = await prisma.patient.findUnique({ where: { id: params.id } });
    if (!patient) return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    return NextResponse.json(patient);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { name, address, contact, medicalHistory } = await request.json();
    const updatedPatient = await prisma.patient.update({
        where: { id: params.id },
        data: { name, address, contact, medicalHistory },
    });
    return NextResponse.json(updatedPatient);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    await prisma.patient.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
}