// src/layouts/AgenLayout.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import AgenSidebar from '../components/navigation/AgenSidebar'; // Sidebar khusus Agen
import { Menu } from 'lucide-react';

const AgenLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Ambil nama user dari localStorage untuk ditampilkan di header
  const getUserName = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user')); 
        return user?.nama_lengkap || 'Agen';
    } catch {
        return 'Agen';
    }
  };
  const userName = getUserName();

  return (
    <div className="flex bg-gray-50 min-h-screen">
        <aside className="sticky top-0 h-screen">
      <AgenSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-medium">{userName.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium">{userName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

AgenLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AgenLayout;