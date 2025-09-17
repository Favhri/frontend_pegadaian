// src/components/navigation/AgenSidebar.jsx

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import apiClient from '../../api/axios'; // <-- Import apiClient
import { 
  LayoutDashboard,
  Users,
  BookText,
  ClipboardCheck,
  LogOut,
  Menu
} from 'lucide-react';

const AgenSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- PERBAIKAN UTAMA DI SINI ---
  const handleLogout = async () => {
    try {
      // 1. Beri tahu server kita mau logout
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 2. Apapun yang terjadi, bersihkan data di browser dan kembali ke login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/agen/dashboard' },
    { title: 'Daftar Agen', icon: <Users size={20} />, path: '/agen/daftar-agen' },
    { title: 'Laporan Harian', icon: <BookText size={20} />, path: '/agen/laporan-harian' },
    { title: 'Laporan Kunjungan', icon: <ClipboardCheck size={20} />, path: '/agen/laporan-kunjungan' },
  ];

  return (
    <aside 
      className={`bg-white h-screen fixed lg:static w-[280px] transition-all duration-300 ease-in-out z-50
        ${sidebarOpen ? 'left-0' : '-left-[280px] lg:left-0'}`}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <span className="text-xl font-bold text-green-700">AGEN PEGADAIAN</span>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="px-4 space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
                    ${location.pathname === item.path 
                      ? 'bg-green-100 text-green-700 font-semibold' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-700 w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

AgenSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default AgenSidebar;