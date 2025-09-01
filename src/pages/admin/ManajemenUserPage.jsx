// src/pages/admin/ManajemenUserPage.jsx

import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal';
import axios from 'axios';

// --- (Komponen-komponen kecil tidak berubah, jadi saya ringkas) ---
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
        <div><p className="text-gray-600 text-sm">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
        <div className={`bg-${color}-100 p-3 rounded-full`}>{icon}</div>
    </div>
);
StatsCard.propTypes = { title: PropTypes.string, value: PropTypes.string, icon: PropTypes.node, color: PropTypes.string };
const UserGroupIcon = (props) => (<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>);
UserGroupIcon.propTypes = { className: PropTypes.string };
const AdminIcon = (props) => (<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>);
AdminIcon.propTypes = { className: PropTypes.string };
const ManagerIcon = (props) => (<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>);
ManagerIcon.propTypes = { className: PropTypes.string };
const StaffIcon = (props) => (<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>);
StaffIcon.propTypes = { className: PropTypes.string };
const AgenIcon = (props) => (<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 100-2 1 1 0 000 2z"></path></svg>);
AgenIcon.propTypes = { className: PropTypes.string };


// --- FORM UNTUK MODAL ---
const UserForm = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nama_lengkap: user?.nama_lengkap || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        role: user?.role || 'user',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            Swal.fire('Error!', 'Password dan konfirmasi password tidak cocok!', 'error');
            return;
        }

        if (!user && !formData.password) {
            Swal.fire('Error!', 'Password wajib diisi untuk user baru!', 'error');
            return;
        }

        const dataToSave = {
            id: user?.id,
            nama_lengkap: formData.nama_lengkap,
            email: formData.email,
            role: formData.role
        };

        if (formData.password) {
            dataToSave.password = formData.password;
        }

        onSave(dataToSave);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder={user ? "Kosongkan jika tidak diubah" : ""} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md"><option value="user">User</option><option value="admin">Admin</option><option value="pimpinan">Pimpinan</option><option value="agen">Agen</option></select></div>
            <div className="flex justify-end gap-4 pt-4 border-t mt-4"><button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button><button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button></div>
        </form>
    );
};
UserForm.propTypes = { user: PropTypes.object, onClose: PropTypes.func.isRequired, onSave: PropTypes.func.isRequired };

// --- KOMPONEN UTAMA HALAMAN ---
const ManajemenUserPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('Semua');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                Swal.fire('Akses Ditolak', 'Anda harus login untuk mengakses halaman ini.', 'error');
                return;
            }
            
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // PERBAIKAN: Langsung ambil dari response.data.data
            const formattedUsers = response.data.data.map(user => ({
                ...user,
                tglBergabung: new Date(user.created_at).toLocaleDateString('id-ID')
            }));
            setUserList(formattedUsers);
        } catch (err) {
            console.error("Gagal mengambil data user:", err);
            Swal.fire('Error!', 'Gagal mengambil data user dari server.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return userList.filter(user => {
            const matchesSearch = user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = filterRole === 'Semua' || user.role === filterRole;
            return matchesSearch && matchesRole;
        });
    }, [userList, searchTerm, filterRole]);

    const handleSaveUser = async (userData) => {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };
        
        try {
            if (userData.id) { // --- UPDATE ---
                await axios.put(`http://localhost:5000/api/users/${userData.id}`, userData, { headers });
                Swal.fire('Berhasil!', 'Data user telah diperbarui.', 'success');
            } else { // --- CREATE ---
                await axios.post('http://localhost:5000/api/users', userData, { headers });
                Swal.fire('Berhasil!', 'User baru telah ditambahkan.', 'success');
            }
            fetchUsers(); // Refresh data
        } catch (err) {
            console.error('Gagal menyimpan user:', err.response?.data || err.message);
            Swal.fire('Error!', err.response?.data?.message || 'Gagal menyimpan data.', 'error');
        }
    };

    const handleDeleteUser = (userId, userName) => {
        Swal.fire({
            title: `Yakin ingin menghapus ${userName}?`,
            text: "Tindakan ini tidak dapat dibatalkan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('authToken');
                    await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    Swal.fire('Terhapus!', `${userName} telah dihapus.`, 'success');
                    fetchUsers(); // Refresh data
                } catch (err) {
                    console.error('Gagal menghapus user:', err.response?.data || err.message);
                    Swal.fire('Error!', err.response?.data?.message || 'Gagal menghapus data.', 'error');
                }
            }
        });
    };

    const openModal = (user = null) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <PageHeader title="Manajemen User" subtitle="Kelola data user, role, dan status akun pegawai" icon={<UserGroupIcon className="w-8 h-8" />} />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                 <StatsCard title="Total User" value={userList.length.toString()} color="blue" icon={<UserGroupIcon className="h-6 w-6" />} />
                 <StatsCard title="Admin" value={userList.filter(u => u.role === 'admin').length.toString()} color="red" icon={<AdminIcon className="h-6 w-6" />} />
                 <StatsCard title="Pimpinan" value={userList.filter(u => u.role === 'pimpinan').length.toString()} color="purple" icon={<ManagerIcon className="h-6 w-6" />} />
                 <StatsCard title="User" value={userList.filter(u => u.role === 'user').length.toString()} color="green" icon={<StaffIcon className="h-6 w-6" />} />
                 <StatsCard title="Agen" value={userList.filter(u => u.role === 'agen').length.toString()} color="orange" icon={<AgenIcon className="h-6 w-6" />} />
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
                            <option>Semua</option><option>user</option><option>admin</option><option>pimpinan</option><option>agen</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <p className="text-center py-8 text-gray-500">Memuat data user...</p> : (
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-green-800 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Nama</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Tgl Bergabung</th><th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{user.nama_lengkap}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 capitalize">{user.role}</td>
                                        <td className="px-6 py-4">{user.tglBergabung}</td>
                                        <td className="px-6 py-4 text-center flex gap-2 justify-center">
                                            <button onClick={() => openModal(user)} className="font-medium text-blue-600 hover:underline">Edit</button>
                                            <button onClick={() => handleDeleteUser(user.id, user.nama_lengkap)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentUser ? 'Edit User' : 'Tambah User Baru'}>
                <UserForm user={currentUser} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} />
            </Modal>
        </div>
    );
};

export default ManajemenUserPage;