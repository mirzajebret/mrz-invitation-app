import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Helper function to generate slug from names
function generateSlug(brideName: string, groomName: string): string {
    const combined = `${brideName}-${groomName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    return combined;
}

// Helper to ensure unique slug
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await prisma.invitation.findUnique({
            where: { slug }
        });

        if (!existing) {
            return slug;
        }

        // Add random suffix if slug exists
        const randomSuffix = Math.floor(Math.random() * 1000);
        slug = `${baseSlug}-${randomSuffix}`;
        counter++;

        // Safety check to prevent infinite loop
        if (counter > 10) {
            slug = `${baseSlug}-${Date.now()}`;
            break;
        }
    }

    return slug;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { brideName, groomName, date, location, musicUrl, themeName } = body;

        // Validation
        if (!brideName || !groomName || !date || !location) {
            return NextResponse.json(
                { error: 'Data tidak lengkap. Nama pengantin, tanggal, dan lokasi wajib diisi.' },
                { status: 400 }
            );
        }

        // Generate unique slug
        const baseSlug = generateSlug(brideName, groomName);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);

        // Create invitation
        const newInvitation = await prisma.invitation.create({
            data: {
                slug: uniqueSlug,
                brideName,
                groomName,
                date: new Date(date),
                location,
                musicUrl: musicUrl || null,
                themeName: themeName || 'default',
            },
        });

        return NextResponse.json(newInvitation, { status: 201 });
    } catch (error) {
        console.error('Invitation Creation Error:', error);
        return NextResponse.json(
            { error: 'Gagal membuat invitation' },
            { status: 500 }
        );
    }
}
