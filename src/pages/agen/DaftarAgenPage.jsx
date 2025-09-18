// src/pages/agen/DaftarAgenPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import { Users, Search } from 'lucide-react';

// Helper untuk format tanggal
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    } catch (e) {
        return '-';
    }
};

const DaftarAgenPage = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAgents = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/agen');
                if (response.data.success) {
                    setAgents(response.data.data);
                }
            } catch (error) {
                Swal.fire('Error', 'Gagal memuat data agen.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const filteredAgents = useMemo(() => 
        agents.filter(agent => 
            (agent?.nama_agen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (agent?.id_agen || '').toLowerCase().includes(searchTerm.toLowerCase())
        ), 
        [agents, searchTerm]
    );

    return (
        <div className="space-y-6">
            {/* ===== HEADER BARU ===== */}
            <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Daftar Agen</h1>
                        <p className="text-green-100">Lihat daftar lengkap agen Pegadaian yang terdaftar.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-end items-center mb-4">
                    <div className="relative w-full md:w-auto">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Cari nama atau ID agen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    {loading ? (
                        <p className="text-center py-8 text-gray-500">Memuat data agen...</p>
                    ) : (
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="p-3">No</th>
                                    <th className="p-3">Tanggal</th>
                                    <th className="p-3">Outlet</th>
                                    <th className="p-3">ID Agen</th>
                                    <th className="p-3">CIF</th>
                                    <th className="p-3">Nama Agen</th>
                                    <th className="p-3">Tgl Pengajuan</th>
                                    <th className="p-3">Tgl Activate</th>
                                    <th className="p-3">Nama Usaha</th>
                                    <th className="p-3">Tipe Agen</th>
                                    <th className="p-3">Referral Agen</th>
                                    <th className="p-3">NIK</th>
                                    <th className="p-3">Nama Mitra Agen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAgents.length > 0 ? filteredAgents.map((agent, index) => (
                                    <tr key={agent.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">{formatDateForDisplay(agent.tanggal)}</td>
                                        <td className="p-3">{agent.outlet || '-'}</td>
                                        <td className="p-3">{agent.id_agen}</td>
                                        <td className="p-3">{agent.cif || '-'}</td>
                                        <td className="p-3 font-semibold text-gray-800">{agent.nama_agen}</td>
                                        <td className="p-3">{formatDateForDisplay(agent.tgl_pengajuan)}</td>
                                        <td className="p-3">{formatDateForDisplay(agent.tgl_activate)}</td>
                                        <td className="p-3">{agent.nama_usaha || '-'}</td>
                                        <td className="p-3">{agent.tipe_agen || '-'}</td>
                                        <td className="p-3">{agent.referral_agen || '-'}</td>
                                        <td className="p-3">{agent.nik}</td>
                                        <td className="p-3">{agent.nama_mitra_agen || '-'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="14" className="text-center py-8 text-gray-500">
                                            Tidak ada data agen yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DaftarAgenPage;