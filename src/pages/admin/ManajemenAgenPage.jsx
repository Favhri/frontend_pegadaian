// favhri/frontend_pegadaian/frontend_pegadaian-d3466cf846b15b6230fd2001ed5e5bbe9d0e3e4e/src/pages/admin/ManajemenAgenPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import Modal from '../../components/Modal';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

// Helper untuk format tanggal
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        return new Date(dateString).toISOString().slice(0, 10);
    } catch (e) {
        return '';
    }
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
};


const PageHeader = ({ title, subtitle, icon }) => (
    <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 mb-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
            <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <p className="text-green-100">{subtitle}</p>
    </div>
);
PageHeader.propTypes = { title: PropTypes.string, subtitle: PropTypes.string, icon: PropTypes.node };

const AgenForm = ({ agen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        tanggal: formatDateForInput(agen?.tanggal) || new Date().toISOString().slice(0, 10),
        outlet: agen?.outlet || '',
        id_agen: agen?.id_agen || '',
        cif: agen?.cif || '',
        nama_agen: agen?.nama_agen || '',
        tgl_pengajuan: formatDateForInput(agen?.tgl_pengajuan),
        tgl_activate: formatDateForInput(agen?.tgl_activate),
        nama_usaha: agen?.nama_usaha || '',
        tipe_agen: agen?.tipe_agen || 'Perorangan',
        referral_agen: agen?.referral_agen || '',
        nik: agen?.nik || '',
        nama_mitra_agen: agen?.nama_mitra_agen || '',
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData, agen?.id || null); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal*</label><input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Outlet</label><input type="text" name="outlet" value={formData.outlet} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">ID Agen*</label><input type="text" name="id_agen" value={formData.id_agen} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">CIF</label><input type="text" name="cif" value={formData.cif} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Agen*</label><input type="text" name="nama_agen" value={formData.nama_agen} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tgl Pengajuan</label><input type="date" name="tgl_pengajuan" value={formData.tgl_pengajuan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tgl Aktivasi</label><input type="date" name="tgl_activate" value={formData.tgl_activate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Usaha</label><input type="text" name="nama_usaha" value={formData.nama_usaha} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tipe Agen</label><select name="tipe_agen" value={formData.tipe_agen} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white"><option>Perorangan</option><option>Badan Usaha</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Referral Agen</label><input type="text" name="referral_agen" value={formData.referral_agen} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">NIK*</label><input type="text" name="nik" value={formData.nik} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Mitra Agen</label><input type="text" name="nama_mitra_agen" value={formData.nama_mitra_agen} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t mt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button>
            </div>
        </form>
    );
};
AgenForm.propTypes = { agen: PropTypes.object, onClose: PropTypes.func.isRequired, onSave: PropTypes.func.isRequired };

const ManajemenAgenPage = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAgen, setCurrentAgen] = useState(null);

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/agen');
            if (response.data.success) { setAgents(response.data.data); }
        } catch (error) { Swal.fire('Error', 'Gagal memuat data agen.', 'error');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchAgents(); }, []);

    const handleSaveAgen = async (formData, agenId) => {
        try {
            const apiCall = agenId ? apiClient.put(`/agen/${agenId}`, formData) : apiClient.post('/agen', formData);
            const response = await apiCall;
            if (response.data.success) {
                Swal.fire('Berhasil!', response.data.message, 'success');
                setIsModalOpen(false);
                fetchAgents();
            }
        } catch (error) { Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data.', 'error'); }
    };

    const handleDelete = (agen) => {
        Swal.fire({
            title: `Yakin ingin menghapus ${agen.nama_agen}?`, text: "Data ini tidak dapat dikembalikan!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, hapus!', cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiClient.delete(`/agen/${agen.id}`);
                    Swal.fire('Terhapus!', `Data agen ${agen.nama_agen} telah dihapus.`, 'success');
                    fetchAgents();
                } catch (error) { Swal.fire('Error', error.response?.data?.message || 'Gagal menghapus data.', 'error'); }
            }
        });
    };

    const openModal = (agen = null) => { setCurrentAgen(agen); setIsModalOpen(true); };

    const filteredAgents = useMemo(() => agents.filter(agent => (agent?.nama_agen || '').toLowerCase().includes((searchTerm || '').toLowerCase())), [agents, searchTerm]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <PageHeader title="Manajemen Agen" subtitle="Kelola semua data agen Pegadaian" icon={<Users />} />
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
                    <button onClick={() => openModal()} className="bg-green-600 w-full md:w-auto text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center space-x-2 text-sm"><Plus /><span>Tambah Agen Baru</span></button>
                    <input type="text" placeholder="Cari nama agen..." value={searchTerm} className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="overflow-x-auto">
                    {loading ? <p className="text-center py-8">Memuat data...</p> : (
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    {/* ====> PERUBAHAN UTAMA DI SINI <==== */}
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Outlet</th>
                                    <th className="px-4 py-3">ID Agen</th>
                                    <th className="px-4 py-3">CIF</th>
                                    <th className="px-4 py-3">Nama Agen</th>
                                    <th className="px-4 py-3">Tgl Pengajuan</th>
                                    <th className="px-4 py-3">Tgl Aktivasi</th>
                                    <th className="px-4 py-3">Nama Usaha</th>
                                    <th className="px-4 py-3">Tipe Agen</th>
                                    <th className="px-4 py-3">Referral Agen</th>
                                    <th className="px-4 py-3">NIK</th>
                                    <th className="px-4 py-3">Nama Mitra Agen</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAgents.map((agent) => (
                                    <tr key={agent.id} className="bg-white border-b hover:bg-gray-50">
                                        {/* ====> PERUBAHAN UTAMA DI SINI <==== */}
                                        <td className="px-4 py-2">{formatDateForDisplay(agent.tanggal)}</td>
                                        <td className="px-4 py-2">{agent.outlet}</td>
                                        <td className="px-4 py-2 font-medium">{agent.id_agen}</td>
                                        <td className="px-4 py-2">{agent.cif}</td>
                                        <td className="px-4 py-2">{agent.nama_agen}</td>
                                        <td className="px-4 py-2">{formatDateForDisplay(agent.tgl_pengajuan)}</td>
                                        <td className="px-4 py-2">{formatDateForDisplay(agent.tgl_activate)}</td>
                                        <td className="px-4 py-2">{agent.nama_usaha}</td>
                                        <td className="px-4 py-2">{agent.tipe_agen}</td>
                                        <td className="px-4 py-2">{agent.referral_agen}</td>
                                        <td className="px-4 py-2">{agent.nik}</td>
                                        <td className="px-4 py-2">{agent.nama_mitra_agen}</td>
                                        <td className="px-4 py-2 flex justify-center gap-4">
                                            <button onClick={() => openModal(agent)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(agent)} className="text-red-600 hover:text-red-800" title="Hapus"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAgen ? 'Edit Data Agen' : 'Tambah Agen Baru'}>
                <AgenForm agen={currentAgen} onClose={() => setIsModalOpen(false)} onSave={handleSaveAgen} />
            </Modal>
        </div>
    );
};

export default ManajemenAgenPage;