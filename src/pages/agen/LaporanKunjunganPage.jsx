// src/pages/agen/LaporanKunjunganPage.jsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import { ClipboardCheck, Plus, Edit, Trash2, Download } from 'lucide-react';
import Modal from '../../components/Modal';

// State awal untuk form, digunakan untuk reset
export const initialFormState = {
    tanggal: new Date().toISOString().slice(0, 10),
    jamKunjungan: '',
    namaAgen: '',
    nomorHp: '',
    outlet: '',
    keteranganKunjungan: '',
    ukuranSpanduk: '',
    benner: '',
    tptBrosur: '',
    lainnya: '',
};

// Komponen FormFields dipindahkan ke luar untuk mencegah bug kehilangan fokus
export const FormFields = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium">Tgl*</label><input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                <div><label className="block text-sm font-medium">Jam Kunjungan*</label><input type="time" name="jamKunjungan" value={formData.jamKunjungan} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                <div><label className="block text-sm font-medium">Nama Agen*</label><input type="text" name="namaAgen" value={formData.namaAgen} onChange={handleChange} placeholder="Nama Agen" className="w-full p-2 border rounded-md" required /></div>
                <div><label className="block text-sm font-medium">Nomor HP</label><input type="text" name="nomorHp" value={formData.nomorHp || ''} onChange={handleChange} placeholder="Nomor HP" className="w-full p-2 border rounded-md" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Outlet</label><input type="text" name="outlet" value={formData.outlet || ''} onChange={handleChange} placeholder="Outlet" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">Keterangan Kunjungan</label><input type="text" name="keteranganKunjungan" value={formData.keteranganKunjungan || ''} onChange={handleChange} placeholder="Keterangan" className="w-full p-2 border rounded-md" /></div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2 mt-4 border-t pt-4">Catatan Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div><label className="block text-sm font-medium">Ukuran Spanduk</label><input type="text" name="ukuranSpanduk" value={formData.ukuranSpanduk || ''} onChange={handleChange} placeholder="Contoh: 2x1" className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium">Benner</label><input type="text" name="benner" value={formData.benner || ''} onChange={handleChange} placeholder="Ada/Tidak" className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium">Tpt Brosur</label><input type="text" name="tptBrosur" value={formData.tptBrosur || ''} onChange={handleChange} placeholder="Ada/Tidak" className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium">Lainnya</label><input type="text" name="lainnya" value={formData.lainnya || ''} onChange={handleChange} placeholder="Catatan Lainnya" className="w-full p-2 border rounded-md" /></div>
                </div>
            </div>
        </div>
    );
};

const LaporanKunjunganPage = () => {
    const [laporanList, setLaporanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLaporan, setCurrentLaporan] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    const fetchLaporan = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/laporan-kunjungan');
            if (response.data.success) {
                setLaporanList(response.data.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Gagal memuat data laporan kunjungan.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLaporan();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiCall = currentLaporan
            ? apiClient.put(`/laporan-kunjungan/${currentLaporan.id}`, formData)
            : apiClient.post('/laporan-kunjungan', formData);
        try {
            const response = await apiCall;
            Swal.fire('Berhasil!', response.data.message, 'success');
            setIsFormVisible(false);
            setIsModalOpen(false);
            setFormData(initialFormState);
            setCurrentLaporan(null);
            fetchLaporan();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data.', 'error');
        }
    };
    
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Anda yakin?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonText: 'Batal',
            confirmButtonText: 'Ya, hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiClient.delete(`/laporan-kunjungan/${id}`);
                    Swal.fire('Terhapus!', 'Laporan berhasil dihapus.', 'success');
                    fetchLaporan();
                } catch (error) {
                    Swal.fire('Error', error.response?.data?.message || 'Gagal menghapus data.', 'error');
                }
            }
        });
    };

    const handleOpenModal = (laporan) => {
        setCurrentLaporan(laporan);
        setFormData({
            tanggal: new Date(laporan.tanggal).toISOString().slice(0, 10),
            jamKunjungan: laporan.jam_kunjungan || '',
            namaAgen: laporan.nama_agen_dikunjungi,
            nomorHp: laporan.nomor_hp || '',
            outlet: laporan.outlet || '',
            keteranganKunjungan: laporan.keterangan_kunjungan || '',
            ukuranSpanduk: laporan.ukuran_spanduk || '',
            benner: laporan.benner || '',
            tptBrosur: laporan.tpt_brosur || '',
            lainnya: laporan.lainnya || '',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLaporan(null);
        setFormData(initialFormState);
    };

    const handleExport = async () => {
        try {
            const response = await apiClient.get('/laporan-kunjungan/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan_Kunjungan_Agen_${new Date().toISOString().slice(0,10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            Swal.fire('Error', 'Gagal mengunduh file export.', 'error');
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <ClipboardCheck size={28} className="text-green-600" />
                        <h1 className="text-2xl font-bold text-gray-800">Laporan Kunjungan Agen</h1>
                    </div>
                     <div className="flex gap-2">
                        {!isFormVisible && (
                            <button onClick={() => { setCurrentLaporan(null); setFormData(initialFormState); setIsFormVisible(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                                <Plus size={18}/> Input Laporan
                            </button>
                        )}
                        <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                            <Download size={18}/> Export
                        </button>
                    </div>
                </div>
            </div>

            {isFormVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
                    <h2 className="text-xl font-bold mb-4">Form Input Laporan Kunjungan</h2>
                    <form onSubmit={handleSubmit}>
                        <FormFields formData={formData} handleChange={handleChange} />
                        <div className="flex justify-end gap-4 border-t pt-4 mt-2">
                            <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Simpan</button>
                        </div>
                    </form>
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Edit Laporan Kunjungan">
                <form onSubmit={handleSubmit}>
                    <FormFields formData={formData} handleChange={handleChange} />
                    <div className="flex justify-end gap-4 border-t pt-4 mt-2">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Simpan Perubahan</button>
                    </div>
                </form>
            </Modal>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-bold mb-4">Data Laporan Kunjungan</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Tgl</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Jam</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Nama Agen</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Nomor HP</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Outlet</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Keterangan</th>
                                <th colSpan="4" className="p-3 text-center border-b border-l">Catatan Branding</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom text-center">Aksi</th>
                            </tr>
                            <tr>
                                <th className="p-2 text-center border-l">Spanduk</th>
                                <th className="p-2 text-center">Benner</th>
                                <th className="p-2 text-center">Brosur</th>
                                <th className="p-2 text-center">Lainnya</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? ( <tr><td colSpan="11" className="text-center py-8">Memuat data...</td></tr> ) 
                            : laporanList.length > 0 ? laporanList.map((laporan) => (
                                <tr key={laporan.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{new Date(laporan.tanggal).toLocaleDateString('id-ID')}</td>
                                    <td className="p-3">{laporan.jam_kunjungan}</td>
                                    <td className="p-3 font-semibold">{laporan.nama_agen_dikunjungi}</td>
                                    <td className="p-3">{laporan.nomor_hp}</td>
                                    <td className="p-3">{laporan.outlet}</td>
                                    <td className="p-3 truncate max-w-xs">{laporan.keterangan_kunjungan}</td>
                                    <td className="p-3 text-center border-l">{laporan.ukuran_spanduk}</td>
                                    <td className="p-3 text-center">{laporan.benner}</td>
                                    <td className="p-3 text-center">{laporan.tpt_brosur}</td>
                                    <td className="p-3 truncate max-w-xs">{laporan.lainnya}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleOpenModal(laporan)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(laporan.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="11" className="text-center py-8">Belum ada data laporan kunjungan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LaporanKunjunganPage;