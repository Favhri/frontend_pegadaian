// src/layouts/UserLayout.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import UserSidebar from '../components/navigation/UserSidebar'; // Import sidebar baru
import { Menu } from 'lucide-react';

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Ambil nama user dari localStorage untuk ditampilkan di header
  const getUserName = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user')); 
        return user?.nama_lengkap || 'User';
    } catch {
        return 'User';
    }
  };
  const userName = getUserName();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <aside className="top-0 h-screen">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-40">
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Profile section */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-medium">{userName.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium">{userName}</span>
            </div>
          </div>
        </header>


{/* Overlay untuk mobile */}
    {sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      ></div>
    )}
    

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

UserLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserLayout;