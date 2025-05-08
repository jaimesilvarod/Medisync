import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const appointments = await prisma.appointment.findMany({
        where: {
            patientId: patientId || undefined,
            doctorId: doctorId || undefined,
            date: { gte: startDate ? new Date(startDate) : undefined, lte: endDate ? new Date(endDate) : undefined },
        },
        include: { patient: true, doctor: true },
    });

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        return NextResponse.json({ pdf: pdfData.toString('base64') });
    });

    doc.text('Reporte de Citas', { align: 'center' });
    appointments.forEach((appt) => {
        doc.text(`Cita: ${appt.id}, Paciente: ${appt.patient.name}, Médico: ${appt.doctor.name}`);
    });
    doc.end();
}