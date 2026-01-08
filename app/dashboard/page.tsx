'use client';

import { useState } from 'react';

interface InvitationData {
    id: string;
    slug: string;
    brideName: string;
    groomName: string;
    date: Date;
    location: string;
    musicUrl?: string;
    themeName: string;
}

export default function DashboardPage() {
    const [formData, setFormData] = useState({
        brideName: '',
        groomName: '',
        date: '',
        location: '',
        musicUrl: '',
        themeName: 'default',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [createdInvitation, setCreatedInvitation] = useState<InvitationData | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/invitations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Gagal membuat invitation');
            }

            setCreatedInvitation(data);

            // Reset form
            setFormData({
                brideName: '',
                groomName: '',
                date: '',
                location: '',
                musicUrl: '',
                themeName: 'default',
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        } finally {
            setIsLoading(false);
        }
    };

    const getInvitationUrl = () => {
        if (!createdInvitation) return '';
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}/${createdInvitation.slug}`;
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(getInvitationUrl());
            alert('Link berhasil disalin!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-600">Buat undangan pernikahan baru</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Form Invitation Baru
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Bride Name */}
                        <div>
                            <label htmlFor="brideName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Mempelai Perempuan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="brideName"
                                name="brideName"
                                required
                                value={formData.brideName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="Contoh: Siti"
                            />
                        </div>

                        {/* Groom Name */}
                        <div>
                            <label htmlFor="groomName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Mempelai Pria <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="groomName"
                                name="groomName"
                                required
                                value={formData.groomName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="Contoh: Ahmad"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Tanggal Pernikahan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Lokasi Acara <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="Contoh: Jakarta Convention Center"
                            />
                        </div>

                        {/* Music URL */}
                        <div>
                            <label htmlFor="musicUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                URL Musik (opsional)
                            </label>
                            <input
                                type="url"
                                id="musicUrl"
                                name="musicUrl"
                                value={formData.musicUrl}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="https://example.com/music.mp3"
                            />
                        </div>

                        {/* Theme */}
                        <div>
                            <label htmlFor="themeName" className="block text-sm font-medium text-gray-700 mb-2">
                                Tema
                            </label>
                            <select
                                id="themeName"
                                name="themeName"
                                value={formData.themeName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            >
                                <option value="default">Default</option>
                                <option value="elegant">Elegant</option>
                                <option value="modern">Modern</option>
                                <option value="romantic">Romantic</option>
                            </select>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Membuat Invitation...' : 'Buat Invitation'}
                        </button>
                    </form>
                </div>

                {/* Success Card - Invitation Link */}
                {createdInvitation && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 border-2 border-green-200">
                        <div className="flex items-center mb-4">
                            <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-green-800">
                                Invitation Berhasil Dibuat!
                            </h3>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 mb-2">
                                <strong>Pengantin:</strong> {createdInvitation.brideName} & {createdInvitation.groomName}
                            </p>
                            <p className="text-gray-700">
                                <strong>Slug:</strong> {createdInvitation.slug}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-green-300">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Link Undangan:
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    readOnly
                                    value={getInvitationUrl()}
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-mono text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={copyToClipboard}
                                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <a
                                href={`/${createdInvitation.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
                            >
                                <span>Lihat Undangan</span>
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
