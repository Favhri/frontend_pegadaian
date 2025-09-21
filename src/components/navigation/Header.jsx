// src/components/navigation/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    // 1. Hapus token dari localStorage
    localStorage.removeItem('authToken');

    // 2. Redirect ke halaman login
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Menutup dropdown jika klik di luar area dropdown
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
    <header className="bg-white shadow-sm sticky top-0 z-20"> {/* Tambah z-index */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-800">Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <span className="text-2xl text-gray-500 hover:text-green-600">🔔</span>
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 items-center justify-center text-white text-xs">
                3
              </span>
            </span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <span className="font-semibold text-gray-700">Admin</span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 border border-gray-100 animate-fade-in-down">
                <div className="py-1">
                  <div className="px-4 py-2 border-b">
                     <p className="text-sm text-gray-700 font-semibold">Admin</p>
                     <p className="text-xs text-gray-500 truncate">admin@pegadaian.co.id</p>
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