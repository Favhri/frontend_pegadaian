// src/components/navigation/SecondaryMenuPanel.jsx

import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const SecondaryMenuPanel = ({ menu, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  if (!menu) return null;

  const handleLinkClick = (path) => {
    navigate(path);
    onClose(); // Tutup panel setelah link diklik
  };

  return (
    // Panel container dengan animasi
    <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg z-10 animate-slide-in border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Header Panel */}
        <div className="flex items-center justify-between p-4 border-b h-20">
          <h3 className="text-lg font-bold text-gray-800">{menu.title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Daftar Link */}
        <nav className="flex-1 p-4 space-y-2">
          {menu.items.map((item, index) => (
            <a
              key={index}
              href={item.path}
              onClick={(e) => { e.preventDefault(); handleLinkClick(item.path); }}
              className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors
                ${activePath.startsWith(item.path)
                  ? 'bg-green-100 font-semibold text-green-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
              }
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
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