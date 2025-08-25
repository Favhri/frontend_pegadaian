// src/pages/admin/ManajemenUserPage.jsx

import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal';

// --- DATA DUMMY ---
const dummyUserList = [
    { id: 1, nama: 'Ahmad Rizki Pratama', email: 'ahmad.rizki@pegadaian.co.id', role: 'Admin', status: 'Aktif', tglBergabung: '2020-01-15' },
    { id: 2, nama: 'Siti Nurhaliza', email: 'siti.nurhaliza@pegadaian.co.id', role: 'Manager', status: 'Aktif', tglBergabung: '2019-03-22' },
    { id: 3, nama: 'Budi Santoso', email: 'budi.santoso@pegadaian.co.id', role: 'Staff', status: 'Aktif', tglBergabung: '2021-07-30' },
    { id: 4, nama: 'Diana Putri', email: 'diana.putri@pegadaian.co.id', role: 'Staff', status: 'Nonaktif', tglBergabung: '2022-11-01' },
    { id: 5, nama: 'Dedi Kurniawan', email: 'dedi.kurniawan@pegadaian.co.id', role: 'Manager', status: 'Aktif', tglBergabung: '2018-05-10' },
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

// --- FORM UNTUK MODAL ---
const UserForm = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nama: user?.nama || '',
        email: user?.email || '',
        role: user?.role || 'Staff',
        status: user?.status || 'Aktif',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...user, ...formData });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Staff</option>
                        <option>Manager</option>
                        <option>Admin</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Aktif</option>
                        <option>Nonaktif</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t mt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button>
            </div>
        </form>
    );
};
UserForm.propTypes = { user: PropTypes.object, onClose: PropTypes.func.isRequired, onSave: PropTypes.func.isRequired };

// --- KOMPONEN UTAMA HALAMAN ---
const ManajemenUserPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userList, setUserList] = useState(dummyUserList);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('Semua');

    const filteredUsers = useMemo(() => {
        return userList.filter(user => {
            const matchesSearch = user.nama.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = filterRole === 'Semua' || user.role === filterRole;
            return matchesSearch && matchesRole;
        });
    }, [userList, searchTerm, filterRole]);

    const handleSaveUser = (userData) => {
        if (userData.id) { // Edit user
            setUserList(prev => prev.map(u => u.id === userData.id ? userData : u));
            Swal.fire('Berhasil!', 'Data user telah diperbarui.', 'success');
        } else { // Tambah user baru
            const newUser = { ...userData, id: Date.now(), tglBergabung: new Date().toISOString().slice(0, 10) };
            setUserList(prev => [newUser, ...prev]);
            Swal.fire('Berhasil!', 'User baru telah ditambahkan.', 'success');
        }
    };

    const openModal = (user = null) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <PageHeader
                title="Manajemen User"
                subtitle="Kelola data user, role, dan status akun pegawai"
                icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.543 5.539A5.002 5.002 0 012 15.5V16a1 1 0 001 1h14a1 1 0 001-1v-.5a5.002 5.002 0 01-5.457-3.961 3.501 3.501 0 00-5.086 0zM16 6a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatsCard title="Total User" value={userList.length.toString()} color="blue" icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>} />
                <StatsCard title="Admin" value={userList.filter(u => u.role === 'Admin').length.toString()} color="red" icon={<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>} />
                <StatsCard title="Manager" value={userList.filter(u => u.role === 'Manager').length.toString()} color="purple" icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>} />
                <StatsCard title="Staff" value={userList.filter(u => u.role === 'Staff').length.toString()} color="green" icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>} />
            </div>

            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <button onClick={() => openModal()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors w-full md:w-auto">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                        Tambah User Baru
                    </button>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input type="text" placeholder="Cari user..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="p-2 border border-gray-300 rounded-md w-full md:w-64" />
                        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                            <option>Semua</option>
                            <option>Admin</option>
                            <option>Manager</option>
                            <option>Staff</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-green-800 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Tgl Bergabung</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{user.nama}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full font-semibold text-xs ${user.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.tglBergabung}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => openModal(user)} className="font-medium text-blue-600 hover:underline">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentUser ? 'Edit User' : 'Tambah User Baru'}>
                <UserForm user={currentUser} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} />
            </Modal>
        </div>
    );
};

export default ManajemenUserPage;
