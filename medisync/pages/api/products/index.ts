import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Product } from '@prisma/client';
import { authenticate } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!authenticate(req, res)) return;

    if (req.method === 'GET') {
        try {
            const products: Product[] = await prisma.product.findMany();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { name, price } = req.body;
            if (!name || price == null) {
                return res.status(400).json({ error: 'Name and price are required' });
            }
            const product: Product = await prisma.product.create({
                data: { name, price },
            });
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}