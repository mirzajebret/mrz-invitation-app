'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Disc, Music } from 'lucide-react';
import type { Invitation } from '@prisma/client';

// Helper untuk format tanggal Indonesia
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};

interface DefaultThemeProps {
    invitation: Invitation;
}

export default function DefaultTheme({ invitation }: DefaultThemeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Form States
    const [name, setName] = useState('');
    const [status, setStatus] = useState('hadir');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const openInvitation = () => {
        setIsOpen(true);
        if (invitation.musicUrl && audioRef.current) {
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
        }
    };

    const submitRSVP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await fetch('/api/rsvp', {
                method: 'POST',
                body: JSON.stringify({
                    invitationId: invitation.id,
                    name,
                    status,
                    message
                })
            });
            alert('Terima kasih, konfirmasi Anda tersimpan!');
            setName('');
            setMessage('');
        } catch (err) {
            alert('Gagal mengirim RSVP');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#FDFBF7] font-serif text-stone-800 overflow-hidden">
            {/* Music Player Hidden */}
            {invitation.musicUrl && (
                <audio ref={audioRef} src={invitation.musicUrl} loop />
            )}

            {/* Music Control Button */}
            {isOpen && invitation.musicUrl && (
                <button
                    onClick={toggleMusic}
                    className="fixed bottom-6 right-6 z-50 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition hover:bg-white"
                >
                    <motion.div
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        {isPlaying ? <Disc className="h-6 w-6" /> : <Music className="h-6 w-6" />}
                    </motion.div>
                </button>
            )}

            {/* Welcome Screen / Cover */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        exit={{ y: '-100%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-100 p-6 text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-stone-500">The Wedding of</p>
                            <h1 className="mb-6 font-serif text-5xl font-bold text-stone-800 md:text-7xl">
                                {invitation.groomName} <span className="text-stone-400">&</span> {invitation.brideName}
                            </h1>
                            <p className="mb-10 text-lg text-stone-600">
                                {formatDate(new Date(invitation.date))}
                            </p>
                            <button
                                onClick={openInvitation}
                                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-stone-900 px-8 py-3 text-white transition hover:bg-stone-700"
                            >
                                <span>Buka Undangan</span>
                                <Play className="h-4 w-4 fill-current" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            {isOpen && (
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mx-auto max-w-2xl px-6 py-20"
                >
                    <section className="mb-20 text-center">
                        <h2 className="mb-6 font-serif text-3xl font-bold">Mempelai</h2>
                        <div className="flex flex-col gap-8 md:flex-row md:justify-center md:gap-16">
                            <div>
                                <h3 className="text-2xl font-bold">{invitation.groomName}</h3>
                                <p className="text-stone-500">Putra Bapak Fulan & Ibu Fulanah</p>
                            </div>
                            <div className="text-4xl text-stone-300">&</div>
                            <div>
                                <h3 className="text-2xl font-bold">{invitation.brideName}</h3>
                                <p className="text-stone-500">Putri Bapak Alan & Ibu Alana</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-20 rounded-2xl bg-white p-8 text-center shadow-xl shadow-stone-200/50">
                        <h2 className="mb-6 font-serif text-3xl font-bold">Acara</h2>
                        <p className="mb-2 text-lg font-semibold">{invitation.location}</p>
                        <p className="text-stone-600">
                            {formatDate(new Date(invitation.date))} <br />
                            Pukul 19:00 WIB - Selesai
                        </p>
                        <div className="mt-6 flex justify-center">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.location)}`}
                                target="_blank"
                                className="rounded-lg border border-stone-200 px-4 py-2 text-sm transition hover:bg-stone-50"
                            >
                                Lihat Lokasi
                            </a>
                        </div>
                    </section>

                    <section className="rounded-2xl bg-white p-8 shadow-xl shadow-stone-200/50">
                        <h2 className="mb-6 text-center font-serif text-3xl font-bold">Buku Tamu</h2>
                        <form onSubmit={submitRSVP} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nama Anda"
                                className="w-full rounded-md border border-stone-200 bg-stone-50 p-3 outline-none focus:border-stone-400"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <select
                                className="w-full rounded-md border border-stone-200 bg-stone-50 p-3 outline-none focus:border-stone-400"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="hadir">Hadir</option>
                                <option value="tidak">Tidak Hadir</option>
                            </select>
                            <textarea
                                placeholder="Ucapan & Doa"
                                rows={4}
                                className="w-full rounded-md border border-stone-200 bg-stone-50 p-3 outline-none focus:border-stone-400"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            <button
                                disabled={isSubmitting}
                                className="w-full rounded-md bg-stone-900 py-3 font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
                            >
                                {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                            </button>
                        </form>
                    </section>
                </motion.main>
            )}
        </div>
    );
}