import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: 'password123', // En producción, hashea con bcrypt
        },
    });
    console.log('Usuario inicializado');
}

main()
    .catch((e) => {
        console.error('Error al inicializar:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });