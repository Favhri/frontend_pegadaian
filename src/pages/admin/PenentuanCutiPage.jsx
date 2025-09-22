// src/pages/admin/PenentuanCutiPage.jsx

import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import Modal from '../../components/Modal';
import { Edit, Trash2 } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminCalendarStyles.css';

// Komponen-komponen UI tidak diubah, hanya dipindahkan ke sini agar rapi
const StatsCard = ({ icon, number, label }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 to-teal-400"></div>
        <div className="text-5xl mb-3 text-green-600">{icon}</div>
        <div className="text-4xl font-bold text-gray-800 mb-1">{number}</div>
        <div className="text-gray-500">{label}</div>
    </div>
);
StatsCard.propTypes = { icon: PropTypes.string, number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), label: PropTypes.string };

const TabButton = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex-1 p-4 text-md font-bold flex items-center justify-center gap-2 transition-all duration-300 ${active ? 'bg-gradient-to-r from-green-600 to-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
        {icon} {label}
    </button>
);
TabButton.propTypes = { icon: PropTypes.string, label: PropTypes.string, active: PropTypes.bool, onClick: PropTypes.func };

const CutiForm = ({ onSave, pegawaiList, initialData = null, onCancel = null }) => {
    const isEditMode = !!initialData;
    const [formData, setFormData] = useState({
        pegawai: initialData?.pegawai || '',
        NIK: initialData?.NIK || '',
        jenis: initialData?.jenis || '',
        tanggalMulai: initialData?.tanggalMulai ? initialData.tanggalMulai.split('T')[0] : '',
        tanggalSelesai: initialData?.tanggalSelesai ? initialData.tanggalSelesai.split('T')[0] : '',
        durasi: initialData?.durasi || '',
        alasan: initialData?.alasan || '',
        selectedPegawaiId: '',
    });

    useEffect(() => {
        if (initialData && pegawaiList.length > 0) {
            const selectedPegawai = pegawaiList.find(p => p.NIK === initialData.NIK);
            if (selectedPegawai) {
                // Menggunakan id_pegawai dari data pegawaiList
                setFormData(prev => ({ ...prev, selectedPegawaiId: selectedPegawai.id_pegawai.toString() }));
            }
        }
    }, [initialData, pegawaiList]);

    useEffect(() => {
        if (formData.tanggalMulai && formData.tanggalSelesai) {
            const start = new Date(formData.tanggalMulai);
            const end = new Date(formData.tanggalSelesai);
            if (end >= start) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setFormData(prev => ({ ...prev, durasi: diffDays }));
            } else {
                setFormData(prev => ({ ...prev, durasi: '' }));
            }
        }
    }, [formData.tanggalMulai, formData.tanggalSelesai]);

    const handlePegawaiChange = (e) => {
        const selectedId = e.target.value;
        const selectedPegawai = pegawaiList.find(p => p.id_pegawai.toString() === selectedId);
        setFormData(prev => ({
            ...prev,
            pegawai: selectedPegawai ? selectedPegawai.nama_lengkap : '',
            NIK: selectedPegawai ? selectedPegawai.NIK : '',
            selectedPegawaiId: selectedId
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, initialData?.id || null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai *</label>
                    <select name="pegawai" value={formData.selectedPegawaiId} onChange={handlePegawaiChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" required>
                        <option value="">Pilih dari Data Master Pegawai</option>
                        {pegawaiList.map(p => <option key={p.id_pegawai} value={p.id_pegawai}>{p.nama_lengkap} - NIK: {p.NIK}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Cuti *</label>
                    <select name="jenis" value={formData.jenis} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" required>
                        <option value="">Pilih Jenis Cuti</option>
                        <option value="tahunan">Cuti Tahunan</option>
                        <option value="sakit">Cuti Sakit</option>
                        <option value="melahirkan">Cuti Melahirkan</option>
                        <option value="besar">Cuti Besar</option>
                        <option value="alasan-penting">Cuti Alasan Penting</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai Cuti *</label>
                    <input type="date" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai Cuti *</label>
                    <input type="date" name="tanggalSelesai" value={formData.tanggalSelesai} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Hari</label>
                    <input type="number" name="durasi" value={formData.durasi} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100" readOnly placeholder="Otomatis terhitung" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alasan/Keperluan Cuti *</label>
                <textarea name="alasan" value={formData.alasan} onChange={handleChange} rows="4" className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="Jelaskan alasan atau keperluan cuti..." required></textarea>
            </div>
            <div className={`flex ${isEditMode ? 'justify-end' : 'justify-start'} gap-4 pt-4`}>
                {isEditMode && <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>}
                <button type="submit" className="px-6 py-3 font-bold text-white bg-gradient-to-r from-green-600 to-teal-500 rounded-lg hover:opacity-90 transition">
                    {isEditMode ? 'Simpan Perubahan' : '💾 Simpan Data Cuti'}
                </button>
            </div>
        </form>
    );
};
CutiForm.propTypes = { onSave: PropTypes.func.isRequired, pegawaiList: PropTypes.array.isRequired, initialData: PropTypes.object, onCancel: PropTypes.func };

const PenentuanCutiPage = () => {
    const [activeTab, setActiveTab] = useState('input');
    const [cutiList, setCutiList] = useState([]);
    const [pegawaiList, setPegawaiList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCuti, setCurrentCuti] = useState(null);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Mengambil semua data tanpa paginasi untuk pegawai
            const [cutiRes, pegawaiRes] = await Promise.all([
                apiClient.get('/cuti'),
                apiClient.get('/pegawai?limit=1000') // Ambil semua pegawai untuk dropdown
            ]);
            
            // Pengecekan data.success sudah tidak ada lagi di API-mu
            setCutiList(cutiRes.data.data);
            setPegawaiList(pegawaiRes.data.data);

        } catch (error) {
            Swal.fire('Error', 'Gagal memuat data.', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleOpenEditModal = (cuti) => {
        setCurrentCuti(cuti);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCuti(null);
    };

    const handleSaveCuti = async (formData, cutiId) => {
        const apiCall = cutiId
            ? apiClient.put(`/cuti/${cutiId}`, formData)
            : apiClient.post('/cuti', formData);

        try {
            const response = await apiCall;
            // Pengecekan data.success sudah tidak ada lagi
            Swal.fire('Berhasil!', response.data.message, 'success');
            handleCloseModal();
            fetchAllData();
            setActiveTab('view');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data.', 'error');
        }
    };

    const handleDeleteCuti = (cuti) => {
        Swal.fire({
            title: `Yakin ingin menghapus cuti ${cuti.pegawai}?`,
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
                    await apiClient.delete(`/cuti/${cuti.id}`);
                    Swal.fire('Terhapus!', 'Data cuti telah dihapus.', 'success');
                    fetchAllData();
                } catch (error) {
                    Swal.fire('Error', error.response?.data?.message || 'Gagal menghapus data.', 'error');
                }
            }
        });
    };
    
    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            for (const cuti of cutiList) {
                // Pastikan tanggal valid sebelum diproses
                const tglMulai = new Date(cuti.tanggalMulai);
                const tglSelesai = new Date(cuti.tanggalSelesai);
                if (isNaN(tglMulai.getTime()) || isNaN(tglSelesai.getTime())) continue;

                tglMulai.setHours(0, 0, 0, 0);
                tglSelesai.setHours(0, 0, 0, 0);
                const tglKalender = new Date(date.setHours(0, 0, 0, 0));

                if (tglKalender >= tglMulai && tglKalender <= tglSelesai) {
                    const isStart = tglKalender.getTime() === tglMulai.getTime();
                    const isEnd = tglKalender.getTime() === tglSelesai.getTime();
                    if (isStart && isEnd) return 'cuti-day cuti-single';
                    if (isStart) return 'cuti-day cuti-start';
                    if (isEnd) return 'cuti-day cuti-end';
                    return 'cuti-day cuti-middle';
                }
            }
        }
        return null;
    };
    
    const filteredData = useMemo(() => 
        cutiList.filter(item => 
            (item.pegawai || '').toLowerCase().includes(searchTerm.toLowerCase())
        ), [cutiList, searchTerm]);

    const stats = useMemo(() => ({
        totalPegawai: pegawaiList.length,
        cutiAktif: cutiList.filter(c => new Date(c.tanggalMulai) <= new Date() && new Date(c.tanggalSelesai) >= new Date()).length,
        totalCuti: cutiList.length,
    }), [cutiList, pegawaiList]);

    return (
        <div className="space-y-8">
            <div className="text-center bg-gradient-to-r from-green-700 to-green-600 text-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-4xl font-bold">📅 Data Cuti Pegawai</h1>
                <p className="mt-2 text-lg opacity-90">Input dan pantau data cuti pegawai secara terpusat</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard icon="👥" number={loading ? '...' : stats.totalPegawai} label="Total Pegawai Terdaftar" />
                <StatsCard icon="✈️" number={loading ? '...' : stats.cutiAktif} label="Sedang Cuti Hari Ini" />
                <StatsCard icon="📋" number={loading ? '...' : stats.totalCuti} label="Total Data Cuti" />
            </div>

            <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
                <TabButton icon="➕" label="Input Cuti Baru" active={activeTab === 'input'} onClick={() => setActiveTab('input')} />
                <TabButton icon="📋" label="Lihat Data Cuti" active={activeTab === 'view'} onClick={() => setActiveTab('view')} />
                <TabButton icon="🗓️" label="Kalender Cuti" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
            </div>

            <div>
                {activeTab === 'input' && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl animate-fadeIn">
                        <h2 className="text-2xl font-bold text-green-800 mb-6 border-b-2 pb-4">Input Data Cuti Pegawai</h2>
                        {loading ? <p>Memuat data pegawai...</p> : <CutiForm onSave={handleSaveCuti} pegawaiList={pegawaiList} />}
                    </div>
                )}
                {activeTab === 'view' && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                        <div className="p-6 bg-gradient-to-r from-green-600 to-teal-500 flex justify-between items-center flex-wrap gap-4">
                            <h2 className="text-xl font-bold text-white">Data Cuti Pegawai</h2>
                            <input 
                                type="text"
                                placeholder="Cari pegawai..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="px-4 py-2 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white focus:text-gray-800 transition"
                            />
                        </div>
                        <div className="overflow-x-auto">
                           {loading ? <p className="text-center py-8">Memuat data...</p> : (
                             <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-green-800 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Nama Pegawai</th>
                                        <th className="px-6 py-3">Jenis Cuti</th>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3 text-center">Durasi</th>
                                        <th className="px-6 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map(item => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.pegawai}</td>
                                            <td className="px-6 py-4 capitalize">{item.jenis}</td>
                                            <td className="px-6 py-4">{new Date(item.tanggalMulai).toLocaleDateString('id-ID')} - {new Date(item.tanggalSelesai).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4 text-center">{item.durasi} hari</td>
                                            <td className="px-6 py-4 text-center flex justify-center gap-4">
                                                <button onClick={() => handleOpenEditModal(item)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteCuti(item)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                           )}
                        </div>
                    </div>
                )}
                {activeTab === 'calendar' && (
                     <div className="bg-white p-8 rounded-2xl shadow-xl animate-fadeIn">
                        <h2 className="text-2xl font-bold text-green-800 mb-6 border-b-2 pb-4">Kalender Cuti</h2>
                        {loading ? <p>Memuat kalender...</p> : <Calendar tileClassName={getTileClassName} />}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={'Edit Data Cuti'}>
                    <CutiForm 
                        onSave={handleSaveCuti}
                        onCancel={handleCloseModal}
                        pegawaiList={pegawaiList}
                        initialData={currentCuti}
                    />
                </Modal>
            )}
        </div>
    );
};

export default PenentuanCutiPage;