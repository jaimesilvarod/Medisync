import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function GET() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const appointments = await prisma.appointment.findMany({
        where: { date: { gte: tomorrow, lte: tomorrow }, reminderSent: false },
        include: { patient: true },
    });

    for (const appointment of appointments) {
        await transporter.sendMail({
            to: appointment.patient.contact,
            subject: 'Recordatorio de cita',
            text: `Tienes una cita mañana a las ${appointment.time}`,
        });
        await prisma.appointment.update({
            where: { id: appointment.id },
            data: { reminderSent: true },
        });
    }
    return NextResponse.json({ message: 'Recordatorios enviados' });
}