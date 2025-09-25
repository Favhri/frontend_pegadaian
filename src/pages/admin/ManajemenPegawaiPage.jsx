// src/pages/admin/ManajemenPegawaiPage.jsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import { Users, PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal'; // Kita akan pakai Modal yang sudah ada

const PageHeader = ({ title, subtitle, icon }) => (
    <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 mb-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
            <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <p className="text-green-100">{subtitle}</p>
    </div>
);

const ManajemenPegawaiPage = () => {
    const [pegawaiList, setPegawaiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPegawai, setCurrentPegawai] = useState(null);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        NIK: '',
        jabatan: '',
        unit_kerja: ''
    });

    const unitKerjaOptions = [
        "CP TERANDAM",
        "UPC BANDAR BUAT",
        "UPC INDARUNG",
        "UPC MATA AIR",
        "UPC ALAI",
        "UPC SITEBA",
        "UPC BALAI BARU",
        "UPC BELIMBING",
        "UPC ANDURING",
        "UPC PARAK LAWEH"
       
    ];

    const fetchPegawai = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/pegawai');
            if (response.data.success) {
                setPegawaiList(response.data.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Gagal memuat data master pegawai.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPegawai();
    }, []);
    
    useEffect(() => {
        if (isEditMode && currentPegawai) {
            setFormData({
                nama_lengkap: currentPegawai.nama_lengkap,
                NIK: currentPegawai.NIK,
                jabatan: currentPegawai.jabatan || '',
                unit_kerja: currentPegawai.unit_kerja || ''
            });
        } else {
            setFormData({ nama_lengkap: '', NIK: '', jabatan: '', unit_kerja: '' });
        }
    }, [isEditMode, currentPegawai]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenModal = (pegawai = null) => {
        if (pegawai) {
            setIsEditMode(true);
            setCurrentPegawai(pegawai);
        } else {
            setIsEditMode(false);
            setCurrentPegawai(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentPegawai(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiCall = isEditMode 
            ? apiClient.put(`/pegawai/${currentPegawai.id}`, formData)
            : apiClient.post('/pegawai', formData);

        try {
            const response = await apiCall;
            if (response.data.success) {
                Swal.fire('Berhasil!', response.data.message, 'success');
                handleCloseModal();
                fetchPegawai();
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data.', 'error');
        }
    };

    const handleDelete = (pegawai) => {
        Swal.fire({
            title: `Yakin ingin menghapus ${pegawai.nama_lengkap}?`,
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await apiClient.delete(`/pegawai/${pegawai.id}`);
                    if(response.data.success) {
                        Swal.fire('Terhapus!', 'Data pegawai telah dihapus.', 'success');
                        fetchPegawai();
                    }
                } catch (error) {
                    Swal.fire('Error', error.response?.data?.message || 'Gagal menghapus data.', 'error');
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Manajemen Data Pegawai" 
                subtitle="Kelola data master semua pegawai di perusahaan" 
                icon={<Users size={32} />} 
            />

            <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                <PlusCircle size={20} />
                Tambah Pegawai Baru
            </button>

            {/* Tabel Data Pegawai */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">Daftar Semua Pegawai</h3>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <p className="text-center py-8">Memuat data...</p> : (
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Nama Lengkap</th>
                                    <th className="px-6 py-3">NIK</th>
                                    <th className="px-6 py-3">Jabatan</th>
                                    <th className="px-6 py-3">Unit Kerja</th>
                                    <th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pegawaiList.map(p => (
                                    <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{p.nama_lengkap}</td>
                                        <td className="px-6 py-4">{p.NIK}</td>
                                        <td className="px-6 py-4">{p.jabatan}</td>
                                        <td className="px-6 py-4">{p.unit_kerja}</td>
                                        <td className="px-6 py-4 flex justify-center items-center gap-4">
                                            <button onClick={() => handleOpenModal(p)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(p)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditMode ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                        <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIK *</label>
                        <input type="text" name="NIK" value={formData.NIK} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                        <input type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja / Cabang</label>
                        <select name="unit_kerja" value={formData.unit_kerja} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                            <option value="">Pilih Unit Kerja</option>
                            {unitKerjaOptions.map(unit => (<option key={unit} value={unit}>{unit}</option>))}
                        </select>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t mt-2">
                         <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                            {isEditMode ? 'Simpan Perubahan' : 'Simpan Pegawai'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManajemenPegawaiPage;