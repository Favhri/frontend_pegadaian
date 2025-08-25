// src/pages/admin/PenentuanCutiPage.jsx

import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

// --- DATA DUMMY ---
const dummyCutiData = [
    { id: 1, pegawai: 'Ahmad Rizki Pratama', nip: '001', jenis: 'tahunan', tanggalMulai: '2024-12-15', tanggalSelesai: '2024-12-20', durasi: 5, status: 'approved', alasan: 'Liburan keluarga akhir tahun' },
    { id: 2, pegawai: 'Siti Nurhaliza', nip: '002', jenis: 'sakit', tanggalMulai: '2024-12-10', tanggalSelesai: '2024-12-12', durasi: 3, status: 'pending', alasan: 'Sakit demam tinggi' },
    { id: 3, pegawai: 'Budi Santoso', nip: '003', jenis: 'alasan-penting', tanggalMulai: '2024-12-08', tanggalSelesai: '2024-12-08', durasi: 1, status: 'approved', alasan: 'Menghadiri acara keluarga' },
    { id: 4, pegawai: 'Maya Sari', nip: '004', jenis: 'melahirkan', tanggalMulai: '2024-11-01', tanggalSelesai: '2025-01-30', durasi: 90, status: 'approved', alasan: 'Cuti melahirkan anak pertama' },
    { id: 5, pegawai: 'Dedi Kurniawan', nip: '005', jenis: 'tahunan', tanggalMulai: '2024-12-23', tanggalSelesai: '2024-12-31', durasi: 8, status: 'pending', alasan: 'Liburan natal dan tahun baru' },
];
const dummyPegawai = [
    { id: "001", nama: "Ahmad Rizki Pratama" },
    { id: "002", nama: "Siti Nurhaliza" },
    { id: "003", nama: "Budi Santoso" },
    { id: "004", nama: "Maya Sari" },
    { id: "005", nama: "Dedi Kurniawan" },
];

// --- KOMPONEN-KOMPONEN KECIL ---

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


// --- KOMPONEN FORM CUTI ---
const CutiForm = ({ onAddCuti }) => {
    const [formData, setFormData] = useState({
        pegawai: '',
        jenis: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        durasi: '',
        status: 'pending',
        alasan: '',
        catatan: ''
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCuti = {
            id: Date.now(),
            ...formData,
            pegawai: dummyPegawai.find(p => p.id === formData.pegawai)?.nama || 'Unknown'
        };
        onAddCuti(newCuti);
        Swal.fire('Berhasil!', 'Data cuti baru telah ditambahkan.', 'success');
        // Reset form
        setFormData({ pegawai: '', jenis: '', tanggalMulai: '', tanggalSelesai: '', durasi: '', status: 'pending', alasan: '', catatan: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
                <FormInput label="Nama Pegawai" icon="�">
                    <select name="pegawai" value={formData.pegawai} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" required>
                        <option value="">Pilih Pegawai</option>
                        {dummyPegawai.map(p => <option key={p.id} value={p.id}>{p.nama} - NIP: {p.id}</option>)}
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
                    <input type="date" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" required />
                </FormInput>
                <FormInput label="Tanggal Selesai Cuti" icon="📅">
                    <input type="date" name="tanggalSelesai" value={formData.tanggalSelesai} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" required />
                </FormInput>
                <FormInput label="Jumlah Hari" icon="📊">
                    <input type="number" name="durasi" value={formData.durasi} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100" readOnly placeholder="Otomatis terhitung" />
                </FormInput>
                <FormInput label="Status Persetujuan" icon="✅">
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" required>
                        <option value="pending">⏳ Pending (Menunggu)</option>
                        <option value="approved">✅ Disetujui</option>
                        <option value="rejected">❌ Ditolak</option>
                    </select>
                </FormInput>
            </div>
            <FormInput label="Alasan/Keperluan Cuti" icon="📝">
                <textarea name="alasan" value={formData.alasan} onChange={handleChange} rows="4" className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" placeholder="Jelaskan alasan atau keperluan cuti..." required></textarea>
            </FormInput>
            <FormInput label="Catatan Admin" icon="📋">
                <textarea name="catatan" value={formData.catatan} onChange={handleChange} rows="4" className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500" placeholder="Catatan atau keterangan tambahan dari admin..."></textarea>
            </FormInput>
            <div className="flex gap-4 pt-4">
                <button type="submit" className="px-6 py-3 font-bold text-white bg-gradient-to-r from-green-600 to-teal-500 rounded-lg hover:opacity-90 transition">💾 Simpan Data Cuti</button>
                <button type="reset" onClick={() => setFormData({ pegawai: '', jenis: '', tanggalMulai: '', tanggalSelesai: '', durasi: '', status: 'pending', alasan: '', catatan: '' })} className="px-6 py-3 font-bold text-white bg-gray-500 rounded-lg hover:opacity-90 transition">🔄 Reset Form</button>
            </div>
        </form>
    );
};
CutiForm.propTypes = { onAddCuti: PropTypes.func };

// --- KOMPONEN UTAMA HALAMAN ---
const PenentuanCutiPage = () => {
    const [activeTab, setActiveTab] = useState('input');
    const [cutiList, setCutiList] = useState(dummyCutiData);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        return cutiList.filter(item => 
            item.pegawai.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [cutiList, searchTerm]);

    const stats = useMemo(() => {
        const today = new Date();
        return {
            totalPegawai: 145,
            cutiAktif: cutiList.filter(c => new Date(c.tanggalMulai) <= today && new Date(c.tanggalSelesai) >= today && c.status === 'approved').length,
            cutiPending: cutiList.filter(c => c.status === 'pending').length,
            cutiSelesaiBulanIni: cutiList.filter(c => new Date(c.tanggalSelesai).getMonth() === today.getMonth() && c.status === 'approved').length,
        }
    }, [cutiList]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAddCuti = (newCuti) => {
        setCutiList(prevList => [newCuti, ...prevList]);
        setActiveTab('view'); // Pindah ke tab view setelah berhasil submit
    };

    return (
        <div className="space-y-8">
            <div className="text-center bg-gradient-to-r from-green-700 to-green-600 text-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-4xl font-bold">📅 Penentuan Cuti Pegawai</h1>
                <p className="mt-2 text-lg opacity-90">Kelola dan pantau data cuti pegawai secara terpusat</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard icon="👥" number={stats.totalPegawai} label="Total Pegawai" />
                <StatsCard icon="📅" number={stats.cutiAktif} label="Cuti Aktif Hari Ini" />
                <StatsCard icon="⏳" number={stats.cutiPending} label="Menunggu Persetujuan" />
                <StatsCard icon="✅" number={stats.cutiSelesaiBulanIni} label="Cuti Selesai Bulan Ini" />
            </div>

            <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
                <TabButton icon="➕" label="Input Cuti Baru" active={activeTab === 'input'} onClick={() => setActiveTab('input')} />
                <TabButton icon="📋" label="Lihat Data Cuti" active={activeTab === 'view'} onClick={() => setActiveTab('view')} />
                <TabButton icon="🗓️" label="Kalender Cuti" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
            </div>

            <div>
                {activeTab === 'input' && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl animate-fadeIn">
                        <h2 className="text-2xl font-bold text-green-800 mb-6 border-b-2 pb-4 flex items-center gap-3">➕ Input Data Cuti Pegawai</h2>
                        <CutiForm onAddCuti={handleAddCuti} />
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
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-green-800 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Nama Pegawai</th>
                                        <th className="px-6 py-3">Jenis Cuti</th>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3 text-center">Durasi</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map(item => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.pegawai}</td>
                                            <td className="px-6 py-4 capitalize">{item.jenis}</td>
                                            <td className="px-6 py-4">{item.tanggalMulai} - {item.tanggalSelesai}</td>
                                            <td className="px-6 py-4 text-center">{item.durasi} hari</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusBadge(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="font-medium text-blue-600 hover:underline">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {activeTab === 'calendar' && (
                     <div className="bg-white p-8 rounded-2xl shadow-xl text-center animate-fadeIn">
                        <h2 className="text-2xl font-bold text-green-800 mb-6">Kalender Cuti</h2>
                        <p className="text-gray-500">Fitur kalender akan diimplementasikan di sini.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PenentuanCutiPage;
