// src/pages/agen/DaftarAgenPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import { Users, Search } from 'lucide-react';

// Helper untuk format tanggal
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '-';
    try {
        // Hanya proses jika bukan string kosong atau null
        const date = new Date(dateString);
        // Cek apakah tanggal valid
        if (isNaN(date.getTime())) {
            return '-';
        }
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
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
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 pb-4 border-b">
                    <div className="flex items-center gap-4">
                        <Users size={28} className="text-green-600" />
                        <h1 className="text-2xl font-bold text-gray-800">Daftar Agen</h1>
                    </div>
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
                                    {/* --- HEADER BARU SESUAI PERMINTAAN --- */}
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
                                        {/* --- DATA BARU SESUAI HEADER --- */}
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