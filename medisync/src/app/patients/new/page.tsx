'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPatient() {
    const [form, setForm] = useState({ name: '', address: '', contact: '', medicalHistory: '' });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer your-token' },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            router.push('/patients');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre"
            />
            <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Dirección"
            />
            <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="Contacto"
            />
            <textarea
                value={form.medicalHistory}
                onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
                placeholder="Historial médico"
            />
            <button type="submit">Guardar</button>
        </form>
    );
}