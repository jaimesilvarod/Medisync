import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const appointments = await prisma.appointment.findMany({
        include: { patient: true, doctor: true },
    });
    return NextResponse.json(appointments);
}

export async function POST(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { patientId, doctorId, date, time } = await request.json();
    const existingAppointment = await prisma.appointment.findFirst({
        where: { doctorId, date, time },
    });
    if (existingAppointment) {
        return NextResponse.json({ error: 'Horario no disponible' }, { status: 400 });
    }
    const appointment = await prisma.appointment.create({
        data: { patientId, doctorId, date, time },
    });
    return NextResponse.json(appointment, { status: 201 });
}