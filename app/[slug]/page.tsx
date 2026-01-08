import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DefaultTheme from '@/components/themes/default-theme';
import { Metadata } from 'next';

// Interface untuk Params (Next.js 15 mengharuskan params sebagai Promise)
interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const invitation = await prisma.invitation.findUnique({
        where: { slug },
    });

    if (!invitation) return { title: 'Not Found' };

    return {
        title: `The Wedding of ${invitation.groomName} & ${invitation.brideName}`,
        description: `Undangan pernikahan ${invitation.groomName} dan ${invitation.brideName}`,
    };
}

export default async function InvitationPage({ params }: PageProps) {
    const { slug } = await params;

    const invitation = await prisma.invitation.findUnique({
        where: { slug },
    });

    if (!invitation) {
        notFound();
    }

    // Di masa depan, Anda bisa switch case 'invitation.themeName' di sini
    // untuk memilih komponen tema yang berbeda.
    return <DefaultTheme invitation={invitation} />;
}