// src/pages/admin/ArsipDokumenPage.jsx

import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal'; // Menggunakan komponen Modal yang sudah ada

// --- DATA DUMMY ---
const dummyDokumenList = [
    { id: 1, nama: 'Laporan Keuangan Q4 2024.pdf', kategori: 'Keuangan', tanggal: '2024-12-15', ukuran: '2.5 MB', status: 'Aktif', uploader: 'Ahmad Rizki', tags: ['laporan', 'keuangan', 'q4'] },
    { id: 2, nama: 'SOP Pegadaian 2024.docx', kategori: 'Operasional', tanggal: '2024-12-10', ukuran: '1.2 MB', status: 'Aktif', uploader: 'Siti Nurhaliza', tags: ['sop', 'operasional', 'prosedur'] },
    { id: 3, nama: 'Data Inventory Emas.xlsx', kategori: 'Inventory', tanggal: '2024-12-08', ukuran: '850 KB', status: 'Arsip', uploader: 'Budi Santoso', tags: ['inventory', 'emas', 'stok'] },
    { id: 4, nama: 'Kontrak Supplier ABC.pdf', kategori: 'Legal', tanggal: '2024-12-05', ukuran: '3.1 MB', status: 'Aktif', uploader: 'Diana Putri', tags: ['kontrak', 'supplier', 'legal'] }
];

// --- KOMPONEN-KOMPONEN KECIL ---
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

const StatsCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-5 rounded-lg shadow-md border-l-4 border-${color}-500 flex items-center justify-between`}>
        <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`bg-${color}-100 p-3 rounded-full`}>{icon}</div>
    </div>
);
StatsCard.propTypes = { title: PropTypes.string, value: PropTypes.string, icon: PropTypes.node, color: PropTypes.string };

// --- KOMPONEN UTAMA ---
const ArsipDokumenPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dokumenList, setDokumenList] = useState(dummyDokumenList);
    // ... state lainnya dari kodemu ...

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logika submit form
        setIsModalOpen(false);
        Swal.fire('Berhasil!', 'Dokumen baru telah berhasil diupload.', 'success');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <PageHeader
                title="Arsip Dokumen"
                subtitle="Kelola dan arsipkan dokumen-dokumen penting pegadaian secara digital"
                icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path></svg>}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatsCard title="Total Dokumen" value="127" color="blue" icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>} />
                <StatsCard title="Dokumen Aktif" value="98" color="green" icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} />
                <StatsCard title="Dalam Arsip" value="25" color="yellow" icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>} />
                <StatsCard title="Storage Digunakan" value="2.8 GB" color="purple" icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>} />
            </div>

            <div className="mb-6">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    Upload Dokumen Baru
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Dokumen Baru">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama File *</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md" required>
                            <option value="">Pilih Kategori</option>
                            <option value="Keuangan">Keuangan</option>
                            <option value="Operasional">Operasional</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload File *</label>
                        <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" required/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Upload</button>
                    </div>
                </form>
            </Modal>

            <div className="bg-white rounded-lg shadow-lg">
                 <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Daftar Dokumen</h3>
                </div>
                <div className="p-6">
                    <p className="text-gray-500">Tabel atau grid daftar dokumen akan ditampilkan di sini.</p>
                </div>
            </div>
        </div>
    );
};

export default ArsipDokumenPage;
