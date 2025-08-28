// src/layouts/AdminLayout.jsx

import { useState, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import SecondaryMenuPanel from '../components/navigation/SecondaryMenuPanel'; // <-- Import komponen baru
import PropTypes from 'prop-types';

const AdminLayout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null); // <-- State untuk panel

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Fungsi untuk membuka/menutup panel dari sidebar
  const handleAccordionClick = (menuData) => {
    if (!isSidebarExpanded) {
      if (activeSubmenu && activeSubmenu.title === menuData.title) {
        setActiveSubmenu(null); // Tutup jika yang diklik sama
      } else {
        setActiveSubmenu(menuData); // Buka yang baru
      }
    }
  };

  // Tutup panel jika sidebar di-expand
  useEffect(() => {
    if (isSidebarExpanded) {
      setActiveSubmenu(null);
    }
  }, [isSidebarExpanded]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar}
        onAccordionClick={handleAccordionClick} // <-- Kirim fungsi ke sidebar
      />
      
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 relative"> {/* <-- Tambahkan relative di sini */}
          {/* Panel sekunder akan muncul di sini */}
          {activeSubmenu && (
            <SecondaryMenuPanel menu={activeSubmenu} onClose={() => setActiveSubmenu(null)} />
          )}

          <div className="p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;