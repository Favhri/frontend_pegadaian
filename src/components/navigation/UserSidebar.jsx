// src/components/navigation/UserSidebar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  Home, 
  Calculator, 
  CreditCard, 
  Landmark, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react';

const UserSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dan data user dari localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Arahkan ke halaman login
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home size={20} />,
      path: '/user/dashboard'
    },
    {
      title: 'Kalkulator Gadai',
      icon: <Calculator size={20} />,
      path: '/user/kalkulator' // Ganti path jika ada halaman khususnya
    },
    {
      title: 'Riwayat Transaksi',
      icon: <CreditCard size={20} />,
      path: '/user/transaksi' // Ganti path jika ada halaman khususnya
    },
    {
      title: 'Info Cabang',
      icon: <Landmark size={20} />,
      path: '/user/cabang' // Ganti path jika ada halaman khususnya
    },
    {
      title: 'Pengaturan',
      icon: <Settings size={20} />,
      path: '/user/settings' // Ganti path jika ada halaman khususnya
    }
  ];

  return (
    <aside 
      className={`bg-white h-screen fixed lg:static w-[280px] transition-all duration-300 ease-in-out z-50
        ${sidebarOpen ? 'left-0' : '-left-[280px] lg:left-0'}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <span className="text-xl font-bold text-green-700">PEGADAIAN</span>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="px-4 space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
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

UserSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default UserSidebar;