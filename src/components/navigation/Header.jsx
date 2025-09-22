// src/components/navigation/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios'; // Pastikan path ini benar

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState({ nama_lengkap: 'Admin', email: 'admin@pegadaian.co.id' }); // State untuk data user
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Ambil data user dari localStorage saat komponen dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Gagal parse data user dari localStorage:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Menutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-800">Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white font-bold text-lg">
                {/* Inisial dari nama lengkap */}
                {user.nama_lengkap ? user.nama_lengkap.charAt(0).toUpperCase() : 'A'}
              </div>
              {/* Tampilkan nama lengkap */}
              <span className="font-semibold text-gray-700">{user.nama_lengkap}</span>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-10 border border-gray-100 animate-fade-in-down">
                <div className="py-1">
                  <div className="px-4 py-3 border-b">
                     {/* Tampilkan nama lengkap dan email dari state */}
                     <p className="text-sm text-gray-800 font-semibold">{user.nama_lengkap}</p>
                     <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;