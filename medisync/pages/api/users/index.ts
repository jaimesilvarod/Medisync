import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import { authenticate } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!authenticate(req, res)) return;

    if (req.method === 'GET') {
        try {
            const users: User[] = await prisma.user.findMany();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ error: 'Name and email are required' });
            }
            const user: User = await prisma.user.create({
                data: { name, email },
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}