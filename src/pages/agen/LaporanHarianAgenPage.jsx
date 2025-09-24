// src/pages/agen/LaporanHarianAgenPage.jsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import { BookText, Plus, Edit, Trash2, Download } from 'lucide-react';
import Modal from '../../components/Modal';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    if (!value) return 'Rp 0';
    const num = Number(value);
    if (isNaN(num)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(num);
};

// State awal untuk form, digunakan untuk reset
export const initialFormState = {
    tanggal: new Date().toISOString().slice(0, 10),
    hari: '',
    posisi: '',
    kegiatan: '',
    pendaftaranAgenBaru: '',
    kunjunganAgen: '',
    gadaiPot: '',
    gadaiOsl: '',
    muliaPot: '',
    muliaOsl: '',
    mikroPot: '',
    mikroOsl: '',
    lainnyaNamaProduk: '',
    lainnyaPot: '',
    lainnyaOsl: '',
};

// Komponen FormFields
export const FormFields = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
                <div><label className="block text-sm font-medium">Tanggal*</label><input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                <div><label className="block text-sm font-medium">Hari*</label><input type="text" name="hari" value={formData.hari} onChange={handleChange} placeholder="Contoh: Senin" className="w-full p-2 border rounded-md" required /></div>
                <div><label className="block text-sm font-medium">Posisi/Lokasi*</label><input type="text" name="posisi" value={formData.posisi} onChange={handleChange} placeholder="Contoh: CP Terandam" className="w-full p-2 border rounded-md" required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div><label className="block text-sm font-medium">Kegiatan</label><textarea name="kegiatan" value={formData.kegiatan || ''} onChange={handleChange} rows="2" placeholder="Jelaskan kegiatan hari ini" className="w-full p-2 border rounded-md"></textarea></div>
                <div>
                    <label className="block text-sm font-medium">Agen Baru & Kunjungan</label>
                    <div className="flex gap-2">
                        <input type="number" name="pendaftaranAgenBaru" value={formData.pendaftaranAgenBaru || ''} onChange={handleChange} placeholder="Jml Agen Baru" className="w-1/2 p-2 border rounded-md" />
                        <input type="number" name="kunjunganAgen" value={formData.kunjunganAgen || ''} onChange={handleChange} placeholder="Jml Kunjungan" className="w-1/2 p-2 border rounded-md" />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Catatan Closingan Produk</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <h4 className="font-medium text-center">Gadai</h4>
                        <input type="number" name="gadaiPot" value={formData.gadaiPot || ''} onChange={handleChange} placeholder="POT" className="w-full p-2 border rounded-md" />
                        <input type="number" name="gadaiOsl" value={formData.gadaiOsl || ''} onChange={handleChange} placeholder="OSL (Rp)" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <h4 className="font-medium text-center">Mulia</h4>
                        <input type="number" name="muliaPot" value={formData.muliaPot || ''} onChange={handleChange} placeholder="POT" className="w-full p-2 border rounded-md" />
                        <input type="number" name="muliaOsl" value={formData.muliaOsl || ''} onChange={handleChange} placeholder="OSL (Rp)" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <h4 className="font-medium text-center">Mikro</h4>
                        <input type="number" name="mikroPot" value={formData.mikroPot || ''} onChange={handleChange} placeholder="POT" className="w-full p-2 border rounded-md" />
                        <input type="number" name="mikroOsl" value={formData.mikroOsl || ''} onChange={handleChange} placeholder="OSL (Rp)" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <h4 className="font-medium text-center">Lainnya</h4>
                        <input type="text" name="lainnyaNamaProduk" value={formData.lainnyaNamaProduk || ''} onChange={handleChange} placeholder="Nama Produk" className="w-full p-2 border rounded-md mb-2" />
                        <input type="number" name="lainnyaPot" value={formData.lainnyaPot || ''} onChange={handleChange} placeholder="POT" className="w-full p-2 border rounded-md" />
                        <input type="number" name="lainnyaOsl" value={formData.lainnyaOsl || ''} onChange={handleChange} placeholder="OSL (Rp)" className="w-full p-2 border rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const LaporanHarianAgenPage = () => {
    const [laporanList, setLaporanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLaporan, setCurrentLaporan] = useState(null);
    const [formData, setFormData] = useState(initialFormState);
    const [jumlahClosingan, setJumlahClosingan] = useState({ pot: 0, osl: 0 });

    const fetchLaporan = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/laporan-harian-agen');
            if (response.data.success) {
                setLaporanList(response.data.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Gagal memuat data laporan.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLaporan();
    }, []);

    useEffect(() => {
        const { gadaiPot, muliaPot, mikroPot, lainnyaPot, gadaiOsl, muliaOsl, mikroOsl, lainnyaOsl } = formData;
        const totalPot = Number(gadaiPot || 0) + Number(muliaPot || 0) + Number(mikroPot || 0) + Number(lainnyaPot || 0);
        const totalOsl = Number(gadaiOsl || 0) + Number(muliaOsl || 0) + Number(mikroOsl || 0) + Number(lainnyaOsl || 0);
        setJumlahClosingan({ pot: totalPot, osl: totalOsl });
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiCall = currentLaporan
            ? apiClient.put(`/laporan-harian-agen/${currentLaporan.id}`, formData)
            : apiClient.post('/laporan-harian-agen', formData);

        try {
            const response = await apiCall;
            Swal.fire('Berhasil!', response.data.message, 'success');
            setIsFormVisible(false);
            setIsModalOpen(false);
            setFormData(initialFormState);
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
                    await apiClient.delete(`/laporan-harian-agen/${id}`);
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
            hari: laporan.hari,
            posisi: laporan.posisi,
            kegiatan: laporan.kegiatan,
            pendaftaranAgenBaru: laporan.pendaftaran_agen_baru,
            kunjunganAgen: laporan.kunjungan_agen,
            gadaiPot: laporan.gadai_pot,
            gadaiOsl: laporan.gadai_osl,
            muliaPot: laporan.mulia_pot,
            muliaOsl: laporan.mulia_osl,
            mikroPot: laporan.mikro_pot,
            mikroOsl: laporan.mikro_osl,
            lainnyaNamaProduk: laporan.lainnya_nama_produk,
            lainnyaPot: laporan.lainnya_pot,
            lainnyaOsl: laporan.lainnya_osl,
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
            const response = await apiClient.get('/laporan-harian-agen/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan_Harian_Agen_${new Date().toISOString().slice(0,10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            Swal.fire('Error', 'Gagal mengunduh file export.', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <BookText size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Laporan Posisi Harian Agen</h1>
                            <p className="text-green-100">Catat dan kelola laporan harian agen di sini.</p>
                        </div>
                    </div>
                </div>
            </div>

            {isFormVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
                    <h2 className="text-xl font-bold mb-4">Form Input Laporan</h2>
                    <form onSubmit={handleSubmit}>
                        <FormFields formData={formData} handleChange={handleChange} />
                        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md mt-4">
                           <span className="font-semibold">Total Closingan:</span>
                           <div>
                                <span className="mr-4">POT: <span className="font-bold">{jumlahClosingan.pot}</span></span>
                                <span>OSL: <span className="font-bold">{formatCurrency(jumlahClosingan.osl)}</span></span>
                           </div>
                        </div>
                        <div className="flex justify-end gap-4 border-t pt-4 mt-2">
                            <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Simpan Laporan</button>
                        </div>
                    </form>
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Edit Laporan Harian">
                 <form onSubmit={handleSubmit}>
                    <FormFields formData={formData} handleChange={handleChange} />
                     <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md mt-4">
                        <span className="font-semibold">Total Closingan:</span>
                        <div>
                            <span className="mr-4">POT: <span className="font-bold">{jumlahClosingan.pot}</span></span>
                            <span>OSL: <span className="font-bold">{formatCurrency(jumlahClosingan.osl)}</span></span>
                        </div>
                     </div>
                    <div className="flex justify-end gap-4 border-t pt-4 mt-2">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Simpan Perubahan</button>
                    </div>
                </form>
            </Modal>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Data Laporan Harian Tersimpan</h2>
                    <div className="flex gap-2 mt-3 sm:mt-0">
                        {!isFormVisible && (
                            <button 
                                onClick={() => { setCurrentLaporan(null); setFormData(initialFormState); setIsFormVisible(true); }} 
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                            >
                                <Plus size={18}/> Input Laporan
                            </button>
                        )}
                        <button 
                            onClick={handleExport} 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                        >
                            <Download size={18}/> Export
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Tanggal</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Hari</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Posisi</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Kegiatan</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Agen Baru</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Kunjungan</th>
                                <th colSpan="2" className="p-3 text-center border-b border-l">Gadai</th>
                                <th colSpan="2" className="p-3 text-center border-b border-l">Mulia</th>
                                <th colSpan="2" className="p-3 text-center border-b border-l">Mikro</th>
                                <th colSpan="3" className="p-3 text-center border-b border-l">Lainnya</th>
                                <th colSpan="2" className="p-3 text-center border-b border-l bg-green-100">Jumlah Closingan</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom text-center">Aksi</th>
                            </tr>
                            <tr>
                                <th className="p-2 text-center border-l">POT</th>
                                <th className="p-2 text-center">OSL</th>
                                <th className="p-2 text-center border-l">POT</th>
                                <th className="p-2 text-center">OSL</th>
                                <th className="p-2 text-center border-l">POT</th>
                                <th className="p-2 text-center">OSL</th>
                                <th className="p-2 text-center border-l">Nama Produk</th>
                                <th className="p-2 text-center">POT</th>
                                <th className="p-2 text-center">OSL</th>
                                <th className="p-2 text-center border-l bg-green-100">POT</th>
                                <th className="p-2 text-center bg-green-100">OSL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? ( <tr><td colSpan="18" className="text-center py-8">Memuat data...</td></tr> ) 
                            : laporanList.length > 0 ? laporanList.map((laporan) => {
                                const totalPot = Number(laporan.gadai_pot || 0) + Number(laporan.mulia_pot || 0) + Number(laporan.mikro_pot || 0) + Number(laporan.lainnya_pot || 0);
                                const totalOsl = Number(laporan.gadai_osl || 0) + Number(laporan.mulia_osl || 0) + Number(laporan.mikro_osl || 0) + Number(laporan.lainnya_osl || 0);
                                return (
                                <tr key={laporan.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{new Date(laporan.tanggal).toLocaleDateString('id-ID')}</td>
                                    <td className="p-3">{laporan.hari}</td>
                                    <td className="p-3">{laporan.posisi}</td>
                                    <td className="p-3 truncate max-w-xs">{laporan.kegiatan}</td>
                                    <td className="p-3 text-center">{laporan.pendaftaran_agen_baru || '0'}</td>
                                    <td className="p-3 text-center">{laporan.kunjungan_agen || '0'}</td>
                                    <td className="p-3 text-center border-l">{laporan.gadai_pot || '0'}</td>
                                    <td className="p-3 text-right">{formatCurrency(laporan.gadai_osl)}</td>
                                    <td className="p-3 text-center border-l">{laporan.mulia_pot || '0'}</td>
                                    <td className="p-3 text-right">{formatCurrency(laporan.mulia_osl)}</td>
                                    <td className="p-3 text-center border-l">{laporan.mikro_pot || '0'}</td>
                                    <td className="p-3 text-right">{formatCurrency(laporan.mikro_osl)}</td>
                                    <td className="p-3 border-l">{laporan.lainnya_nama_produk || '-'}</td>
                                    <td className="p-3 text-center">{laporan.lainnya_pot || '0'}</td>
                                    <td className="p-3 text-right">{formatCurrency(laporan.lainnya_osl)}</td>
                                    <td className="p-3 text-center border-l bg-gray-100 font-semibold">{totalPot}</td>
                                    <td className="p-3 text-right bg-gray-100 font-semibold">{formatCurrency(totalOsl)}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleOpenModal(laporan)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(laporan.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )}) : (
                                <tr><td colSpan="18" className="text-center py-8">Belum ada data laporan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LaporanHarianAgenPage;