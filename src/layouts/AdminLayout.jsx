import { useState, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import SecondaryMenuPanel from '../components/navigation/SecondaryMenuPanel';
import PropTypes from 'prop-types';

const AdminLayout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarExpanded(prev => !prev);
  };

  const handleAccordionClick = (menuData) => {
    if (!isSidebarExpanded) {
      if (activeSubmenu && activeSubmenu.title === menuData.title) {
        setActiveSubmenu(null);
      } else {
        setActiveSubmenu(menuData);
      }
    }
  };

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
        onAccordionClick={handleAccordionClick}
      />
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 relative">
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