import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import { authenticate } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!authenticate(req, res)) return;

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const user: User | null = await prisma.user.findUnique({
                where: { id: id as string },
            });
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { name, email } = req.body;
            const updatedUser: User = await prisma.user.update({
                where: { id: id as string },
                data: { name, email },
            });
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.user.delete({ where: { id: id as string } });
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}