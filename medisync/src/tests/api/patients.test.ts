import { GET, POST } from '@/app/api/patients/route';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

const prisma = mockDeep<PrismaClient>();

describe('Patients API', () => {
    it('should get all patients', async () => {
        prisma.patient.findMany.mockResolvedValue([]);
        const response = await GET(new Request('http://localhost/api/patients', { headers: { Authorization: 'Bearer valid-token' } }));
        expect(response.status).toBe(200);
    });

    it('should create a patient', async () => {
        const patient = { id: '1', name: 'Test', address: '123', contact: 'test@example.com', medicalHistory: '' };
        prisma.patient.create.mockResolvedValue(patient);
        const response = await POST(
            new Request('http://localhost/api/patients', {
                method: 'POST',
                headers: { Authorization: 'Bearer valid-token', 'Content-Type': 'application/json' },
                body: JSON.stringify(patient),
            })
        );
        expect(response.status).toBe(201);
    });
});