// src/components/navigation/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const menuItems = [
    { title: 'Utama', isMenuSection: true },
    { title: 'Dashboard', icon: '🏠', path: '/admin/dashboard' },
    { title: 'Manajemen', isMenuSection: true },
    {
        title: 'Operasional', icon: '📊', submenu: [
            { title: 'Input Laporan', path: '/admin/laporan' },
            { title: 'Arsip Dokumen', path: '/admin/arsip' },
        ]
    },
    {
        title: 'Sumber Daya', icon: '👥', submenu: [
            { title: 'Data Cuti', path: '/admin/penentuan-cuti' },
            { title: 'Manajemen User', path: '/admin/users' },
            { title: 'Manajemen Agen', path: '/admin/agen' },
            { title: 'Struktur Organisasi', path: '/admin/struktur-organisasi' },
        ]
    },
];

const NavLink = ({ to, icon, children, activePath, isExpanded, isSubmenu }) => {
    const navigate = useNavigate();
    const isActive = activePath.startsWith(to);

    return (
        <a href={to} onClick={(e) => { e.preventDefault(); navigate(to); }}
            className={`flex items-center w-full h-12 text-white transition-colors duration-200 group relative ${isExpanded ? (isSubmenu ? 'pl-16 pr-4 text-sm' : 'pl-6') : 'justify-center'}`}
            title={!isExpanded ? children : ''}>
            <div className={`absolute left-0 h-full w-1 bg-yellow-400 rounded-r-full transition-transform duration-300 ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>
            {icon && <span className="text-2xl">{icon}</span>}
            {isExpanded && <span className="ml-4 font-medium whitespace-nowrap">{children}</span>}
        </a>
    );
};
NavLink.propTypes = { to: PropTypes.string, icon: PropTypes.string, children: PropTypes.string, activePath: PropTypes.string, isExpanded: PropTypes.bool, isSubmenu: PropTypes.bool };

const AccordionMenu = ({ title, icon, submenu, activePath, isExpanded, onAccordionClick }) => {
    const hasActiveChild = submenu.some(item => activePath.startsWith(item.path));
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Hanya buka accordion secara default jika ada anak yang aktif DAN sidebar expanded
        setIsOpen(isExpanded && hasActiveChild);
    }, [isExpanded, hasActiveChild, activePath]);

    const handleClick = () => {
        if (isExpanded) {
            setIsOpen(prev => !prev);
        } else {
            onAccordionClick({ title, items: submenu });
        }
    };

    return (
        <div>
            <button onClick={handleClick}
                className={`flex items-center w-full h-12 text-white transition-colors duration-200 group relative ${isExpanded ? 'pl-6' : 'justify-center'}`}>
                <div className={`absolute left-0 h-full w-1 bg-yellow-400 rounded-r-full transition-transform duration-300 ${hasActiveChild ? 'scale-y-100' : 'scale-y-0'}`}></div>
                {icon && <span className="text-2xl">{icon}</span>}
                {isExpanded && (
                    <>
                        <span className="ml-4 font-medium whitespace-nowrap flex-1 text-left">{title}</span>
                        <span className={`mr-4 transform transition-transform duration-300 text-sm ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
                    </>
                )}
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden bg-black/20 ${isOpen && isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                {submenu.map(item => <NavLink key={item.path} {...item} activePath={activePath} isExpanded={isExpanded} isSubmenu />)}
            </div>
        </div>
    );
};
AccordionMenu.propTypes = { title: PropTypes.string, icon: PropTypes.string, submenu: PropTypes.array, activePath: PropTypes.string, isExpanded: PropTypes.bool, onAccordionClick: PropTypes.func };

const Sidebar = ({ isExpanded, toggleSidebar, onAccordionClick }) => {
    const location = useLocation();

    return (
        <aside className={`bg-green-700 flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}>
            <div className={`flex items-center h-20 px-4 border-b border-white/10 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                <img src={isExpanded ? "/src/assets/logo-pegadaian-white.svg" : "/vite.svg"}
                    alt="logo" className={`transition-all duration-300 ${isExpanded ? 'h-10' : 'h-8'}`} />
            </div>
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item, index) => {
                    if (item.isMenuSection) return isExpanded && <h3 key={index} className="px-6 py-2 text-xs font-bold uppercase text-white/60">{item.title}</h3>;
                    if (item.submenu) return <AccordionMenu key={index} {...item} activePath={location.pathname} isExpanded={isExpanded} onAccordionClick={onAccordionClick} />;
                    return <NavLink key={index} {...item} activePath={location.pathname} isExpanded={isExpanded} />;
                })}
            </nav>
            <div className="border-t border-white/10 p-2">
                <div className="flex justify-center">
                    <button onClick={toggleSidebar} className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                        <span className={`transform transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}>❮</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
Sidebar.propTypes = { isExpanded: PropTypes.bool.isRequired, toggleSidebar: PropTypes.func.isRequired, onAccordionClick: PropTypes.func };

export default Sidebar;