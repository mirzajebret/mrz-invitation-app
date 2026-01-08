import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DefaultTheme from '@/components/themes/default-theme';
import type { Metadata } from 'next';

// TypeScript interface untuk Props halaman dinamis
interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate Metadata dinamis untuk SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const invitation = await prisma.invitation.findUnique({
        where: { slug },
    });

    if (!invitation) {
        return {
            title: 'Undangan Tidak Ditemukan',
        };
    }

    return {
        title: `Undangan Pernikahan ${invitation.groomName} & ${invitation.brideName}`,
        description: `Kami mengundang Anda untuk hadir di pernikahan kami di ${invitation.location}`,
    };
}

export default async function InvitationPage({ params }: PageProps) {
    // 1. Ambil slug dari params (wajib await di Next.js 15+)
    const { slug } = await params;

    // 2. Fetch data dari database
    const invitation = await prisma.invitation.findUnique({
        where: { slug },
        // include: { rsvps: true } // Uncomment jika ingin menampilkan list ucapan
    });

    // 3. Handle jika undangan tidak ditemukan (404)
    if (!invitation) {
        notFound();
    }

    // 4. Render Theme Component berdasarkan themeName (untuk sekarang kita hardcode default)
    // Nanti Anda bisa buat switch case di sini jika punya banyak tema.
    return <DefaultTheme invitation={invitation} />;
}