import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const content = await prisma.content.findMany();
    return NextResponse.json(content);
}

export async function POST(request: Request) {
    const user = authenticate(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { page, title, body } = await request.json();
    const latest = await prisma.content.findFirst({
        where: { page },
        orderBy: { version: 'desc' },
    });
    const version = latest ? latest.version + 1 : 1;
    const content = await prisma.content.create({
        data: { page, title, body, version },
    });
    return NextResponse.json(content, { status: 201 });
}