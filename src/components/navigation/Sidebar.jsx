// src/components/navigation/Sidebar.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

// Komponen NavLink
const NavLink = ({ to, icon, children, activePath, setActivePath }) => {
  const navigate = useNavigate();
  const isActive = activePath.startsWith(to);

  const handleClick = (e) => {
    e.preventDefault();
    setActivePath(to);
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={`flex items-center px-6 py-3 text-white border-l-4 transition-colors duration-200 ${isActive ? 'bg-white/10 border-yellow-400' : 'border-transparent hover:bg-white/10'}`}>
      <span className="mr-4 text-xl">{icon}</span>
      <span>{children}</span>
    </a>
  );
};
NavLink.propTypes = { to: PropTypes.string.isRequired, icon: PropTypes.string.isRequired, children: PropTypes.string.isRequired, activePath: PropTypes.string.isRequired, setActivePath: PropTypes.func.isRequired };

// Komponen LogoutLink
const LogoutLink = ({ icon, children, onClick }) => (
    <a href="#" onClick={onClick} className="flex items-center px-6 py-3 text-white border-l-4 border-transparent hover:bg-white/10 transition-colors duration-200">
        <span className="mr-4 text-xl">{icon}</span>
        <span>{children}</span>
    </a>
);
LogoutLink.propTypes = { icon: PropTypes.string.isRequired, children: PropTypes.string.isRequired, onClick: PropTypes.func.isRequired };

// Komponen MenuSection
const MenuSection = ({ title }) => (<h3 className="px-6 py-3 text-xs font-bold uppercase text-white/60">{title}</h3>);
MenuSection.propTypes = { title: PropTypes.string.isRequired };

const Sidebar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Anda yakin ingin logout?',
      text: "Anda akan diarahkan kembali ke halaman login.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, logout!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login');
      }
    });
  };

  const handleComingSoon = (e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Segera Hadir',
        text: 'Halaman ini sedang dalam pengembangan.',
        icon: 'info',
        confirmButtonColor: '#28a745',
    });
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-green-800 to-green-600 text-white flex-col hidden md:flex">
      <div className="p-6 text-center border-b border-white/10">
        <img src="/src/assets/terndam.png" alt="logo" style={{ width: '150px', height: 'auto', margin: '0 auto' }} />
        {/* <h1 className="text-2xl font-bold flex items-center justify-center gap-2">💎 PEGADAIAN</h1> */}
        {/* <p className="mt-2 text-sm opacity-80">Admin Dashboard v1.0.0</p> */}
      </div>
      <nav className="flex-1 py-4">
        <MenuSection title="Main" />
        <NavLink to="/admin/dashboard" icon="🏠" activePath={activePath} setActivePath={setActivePath}>Dashboard</NavLink>
        
        <MenuSection title="Manajemen" />
        <NavLink to="/admin/laporan" icon="📊" activePath={activePath} setActivePath={setActivePath}>Input Laporan</NavLink>
        <NavLink to="/admin/arsip" icon="📁" activePath={activePath} setActivePath={setActivePath}>Arsip Dokumen</NavLink>
        <NavLink to="/admin/penentuan-cuti" icon="📅" activePath={activePath} setActivePath={setActivePath}>Penentuan Cuti</NavLink>
        <a href="#" onClick={handleComingSoon} className="flex items-center px-6 py-3 text-white border-l-4 border-transparent hover:bg-white/10"><span className="mr-4 text-xl">📢</span>Input Pengumuman</a>
        {/* --- PERBAIKAN DI SINI --- */}
        <NavLink to="/admin/users" icon="👥" activePath={activePath} setActivePath={setActivePath}>Manajemen User</NavLink>
        <NavLink to="/admin/agen" icon="🤝" activePath={activePath} setActivePath={setActivePath}>Manajemen Agen</NavLink>
        <NavLink to="/admin/struktur-organisasi" icon="🤝" activePath={activePath} setActivePath={setActivePath}>Struktur Organisasi</NavLink>

        
        <MenuSection title="Sistem" />
        <a href="#" onClick={handleComingSoon} className="flex items-center px-6 py-3 text-white border-l-4 border-transparent hover:bg-white/10"><span className="mr-4 text-xl">⚙️</span>Pengaturan</a>
        <LogoutLink icon="🚪" onClick={handleLogout}>Logout</LogoutLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
