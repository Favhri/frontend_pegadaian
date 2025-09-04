// src/pages/admin/PenentuanCutiPage.jsx

import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';

// --- KOMPONEN-KOMPONEN KECIL (UI Elements) ---

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

const FormInput = ({ label, icon, children }) => (
    <div className="mb-4">
        <label className="flex items-center gap-2 mb-2 text-sm font-bold text-green-800">
            {icon} {label}
        </label>
        {children}
    </div>
);
FormInput.propTypes = { label: PropTypes.string, icon: PropTypes.string, children: PropTypes.node };

// --- FORM CUTI (MENGGUNAKAN DATA MASTER PEGAWAI) ---
const CutiForm = ({ onAddCuti, pegawaiList }) => {
    const [formData, setFormData] = useState({
        pegawai: '',
        NIK: '',
        jenis: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        durasi: '',
        alasan: '',
        selectedPegawaiId: '',
    });

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
        const selectedPegawai = pegawaiList.find(p => p.id.toString() === selectedId);
        if (selectedPegawai) {
            setFormData(prev => ({
                ...prev,
                pegawai: selectedPegawai.nama_lengkap,
                NIK: selectedPegawai.NIK,
                selectedPegawaiId: selectedId
            }));
        } else {
             setFormData(prev => ({ ...prev, pegawai: '', NIK: '', selectedPegawaiId: ''}));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddCuti(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
                <FormInput label="Nama Pegawai" icon="👤">
                    <select name="pegawai" value={formData.selectedPegawaiId} onChange={handlePegawaiChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" required>
                        <option value="">Pilih dari Data Master Pegawai</option>
                        {pegawaiList.map(p => <option key={p.id} value={p.id}>{p.nama_lengkap} - NIK: {p.NIK}</option>)}
                    </select>
                </FormInput>
                <FormInput label="Jenis Cuti" icon="📝">
                    <select name="jenis" value={formData.jenis} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" required>
                        <option value="">Pilih Jenis Cuti</option>
                        <option value="tahunan">Cuti Tahunan</option>
                        <option value="sakit">Cuti Sakit</option>
                        <option value="melahirkan">Cuti Melahirkan</option>
                        <option value="besar">Cuti Besar</option>
                        <option value="alasan-penting">Cuti Alasan Penting</option>
                    </select>
                </FormInput>
                <FormInput label="Tanggal Mulai Cuti" icon="📅">
                    <input type="date" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                </FormInput>
                <FormInput label="Tanggal Selesai Cuti" icon="📅">
                    <input type="date" name="tanggalSelesai" value={formData.tanggalSelesai} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                </FormInput>
                <div className="md:col-span-2">
                    <FormInput label="Jumlah Hari" icon="📊">
                        <input type="number" name="durasi" value={formData.durasi} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100" readOnly placeholder="Otomatis terhitung" />
                    </FormInput>
                </div>
            </div>
            <FormInput label="Alasan/Keperluan Cuti" icon="📝">
                <textarea name="alasan" value={formData.alasan} onChange={handleChange} rows="4" className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="Jelaskan alasan atau keperluan cuti..." required></textarea>
            </FormInput>
            <div className="flex gap-4 pt-4">
                <button type="submit" className="px-6 py-3 font-bold text-white bg-gradient-to-r from-green-600 to-teal-500 rounded-lg hover:opacity-90 transition">💾 Simpan Data Cuti</button>
            </div>
        </form>
    );
};
CutiForm.propTypes = { onAddCuti: PropTypes.func.isRequired, pegawaiList: PropTypes.array.isRequired };

// --- KALENDER VIEW ---
const CutiCalendarView = ({ cutiList, loading }) => {
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    if (loading) return <p className="text-center p-8">Memuat kalender...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Kalender Cuti Karyawan</h2>
            <div className="space-y-3">
                {cutiList.length > 0 ? cutiList.map(item => (
                    <div key={item.id} className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <p className="font-bold text-green-900">{item.pegawai}</p>
                            <p className="text-sm text-green-700 capitalize">{item.jenis}</p>
                        </div>
                        <p className="font-semibold text-green-800 text-sm">
                           {formatDate(item.tanggalMulai)} - {formatDate(item.tanggalSelesai)}
                        </p>
                    </div>
                )) : <p className="text-center text-gray-500 p-4">Tidak ada jadwal cuti untuk ditampilkan.</p>}
            </div>
        </div>
    );
};
CutiCalendarView.propTypes = { cutiList: PropTypes.array.isRequired, loading: PropTypes.bool.isRequired };

// --- KOMPONEN UTAMA HALAMAN ---
const PenentuanCutiPage = () => {
    const [activeTab, setActiveTab] = useState('input');
    const [cutiList, setCutiList] = useState([]);
    const [pegawaiList, setPegawaiList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAllCuti = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/cuti');
            if (response.data.success) {
                setCutiList(response.data.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Gagal memuat data cuti.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchPegawai = async () => {
        try {
            const response = await apiClient.get('/pegawai');
            if (response.data.success) {
                setPegawaiList(response.data.data);
            }
        } catch (err) {
            console.error("Gagal mengambil data pegawai:", err);
            Swal.fire('Error', 'Gagal memuat daftar pegawai.', 'error');
        }
    };
    
    useEffect(() => {
        if (activeTab === 'input') {
            if (pegawaiList.length === 0) fetchPegawai();
        } else {
            fetchAllCuti();
        }
    }, [activeTab]);

    const filteredData = useMemo(() => {
        return cutiList.filter(item => 
            item.pegawai.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [cutiList, searchTerm]);

    const stats = useMemo(() => {
        const today = new Date();
        return {
            totalPegawai: pegawaiList.length,
            cutiAktif: cutiList.filter(c => new Date(c.tanggalMulai) <= today && new Date(c.tanggalSelesai) >= today).length,
            totalCuti: cutiList.length,
        };
    }, [cutiList, pegawaiList]);

    const handleAddCuti = async (newCutiData) => {
        try {
            const response = await apiClient.post('/cuti', newCutiData);
            if (response.data.success) {
                Swal.fire('Berhasil!', 'Data cuti baru telah ditambahkan.', 'success');
                setActiveTab('view'); // Pindah ke tab view untuk melihat hasilnya
            }
        } catch (error) {
             Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data cuti.', 'error');
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center bg-gradient-to-r from-green-700 to-green-600 text-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-4xl font-bold">📅 Data Cuti Pegawai</h1>
                <p className="mt-2 text-lg opacity-90">Input dan pantau data cuti pegawai secara terpusat</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard icon="👥" number={stats.totalPegawai || '...'} label="Total Pegawai Terdaftar" />
                <StatsCard icon="✈️" number={stats.cutiAktif} label="Sedang Cuti Hari Ini" />
                <StatsCard icon="📋" number={stats.totalCuti} label="Total Data Cuti" />
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
                        <CutiForm onAddCuti={handleAddCuti} pegawaiList={pegawaiList} />
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
                                            <td className="px-6 py-4 text-center">
                                                <button className="font-medium text-blue-600 hover:underline">Edit</button>
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
                        <CutiCalendarView cutiList={cutiList} loading={loading} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PenentuanCutiPage;