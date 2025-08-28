import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const SecondaryMenuPanel = ({ menu, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  // Only show when sidebar is collapsed
  if (!menu || !menu.showWhenCollapsed) return null;

  const handleLinkClick = (path) => {
    navigate(path);
    onClose();
  };

  // Get position from menu data or use default
  const panelStyle = menu.position ? {
    position: 'fixed',
    top: `${menu.position.top}px`,
    left: `${menu.position.left}px`,
    zIndex: 50
  } : {
    position: 'absolute',
    top: '80px',
    left: '85px',
    zIndex: 50
  };

  return (
    <>      
      {/* Panel - Positioned next to clicked menu */}
      <div 
        className="w-48 bg-white shadow-xl animate-slide-in border border-gray-200 rounded-lg overflow-hidden"
        style={panelStyle}
      >
        {/* Menu Title Header */}
        {/* <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700">{menu.title}</h4>
        </div> */}
        
        {/* Navigation Items - Compact */}
        <div className="py-1">
          {menu.items.map((item, index) => {
            const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
            
            return (
              <button
                key={index}
                onClick={() => handleLinkClick(item.path)}
                className={`flex items-center w-full px-4 py-2 text-sm transition-colors text-left hover:bg-gray-50 ${
                  isActive
                    ? 'bg-green-50 font-medium text-green-700 border-l-4 border-green-500'
                    : 'text-gray-700 border-l-4 border-transparent'
                }`}
              >
                <span className="flex-1">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

SecondaryMenuPanel.propTypes = {
  menu: PropTypes.shape({
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default SecondaryMenuPanel;