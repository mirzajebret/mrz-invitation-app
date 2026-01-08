import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { invitationId, name, status, message } = body;

        // Validasi sederhana
        if (!invitationId || !name || !status) {
            return NextResponse.json(
                { error: 'Data tidak lengkap' },
                { status: 400 }
            );
        }

        const newRSVP = await prisma.rSVP.create({
            data: {
                invitationId,
                name,
                status,
                message,
            },
        });

        return NextResponse.json(newRSVP, { status: 201 });
    } catch (error) {
        console.error('RSVP Error:', error);
        return NextResponse.json(
            { error: 'Gagal menyimpan RSVP' },
            { status: 500 }
        );
    }
}