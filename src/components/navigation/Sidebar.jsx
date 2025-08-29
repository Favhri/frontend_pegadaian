// src/components/navigation/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const menuItems = [
    { title: 'Utama', isMenuSection: true },
    { title: 'Dashboard', icon: '🏠', path: '/admin/dashboard' },
    { title: 'Manajemen', isMenuSection: true },
    {
        title: 'Operasional', 
        icon: '📊', 
        submenu: [
            { title: 'Input Laporan', path: '/admin/laporan' },
            { title: 'Arsip Dokumen', path: '/admin/arsip' },
        ]
    },
    {
        title: 'Sumber Daya', 
        icon: '👥', 
        submenu: [
            { title: 'Data Cuti', path: '/admin/penentuan-cuti' },
            { title: 'Manajemen User', path: '/admin/users' },
            { title: 'Manajemen Agen', path: '/admin/agen' },
            { title: 'Struktur Organisasi', path: '/admin/struktur-organisasi' },
        ]
    },
];

const NavLink = ({ to, icon, children, activePath, isExpanded, isSubmenu }) => {
    const navigate = useNavigate();
    const isActive = activePath === to || activePath.startsWith(to + '/');

    const handleClick = (e) => {
        e.preventDefault();
        navigate(to);
    };

    return (
        <a 
            href={to} 
            onClick={handleClick}
            className={`flex items-center w-full h-12 text-white transition-colors duration-200 group relative hover:bg-white/10 ${
                isExpanded ? (isSubmenu ? 'pl-16 pr-4 text-sm' : 'pl-6 pr-4') : 'justify-center'
            } ${isActive ? 'bg-white/20' : ''}`}
            title={!isExpanded ? children : ''}
        >
            <div className={`absolute left-0 h-full w-1 bg-yellow-400 rounded-r-full transition-transform duration-300 ${
                isActive ? 'scale-y-100' : 'scale-y-0'
            }`}></div>
            {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
            {isExpanded && <span className="ml-4 font-medium whitespace-nowrap">{children}</span>}
        </a>
    );
};

NavLink.propTypes = { 
    to: PropTypes.string.isRequired, 
    icon: PropTypes.string, 
    children: PropTypes.string.isRequired, 
    activePath: PropTypes.string.isRequired, 
    isExpanded: PropTypes.bool.isRequired, 
    isSubmenu: PropTypes.bool 
};

const AccordionMenu = ({ title, icon, submenu, activePath, isExpanded, onAccordionClick }) => {
    const hasActiveChild = submenu.some(item => activePath === item.path || activePath.startsWith(item.path + '/'));
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Buka accordion jika ada child yang aktif dan sidebar expanded
        if (isExpanded && hasActiveChild) {
            setIsOpen(true);
        } else if (!isExpanded) {
            setIsOpen(false);
        }
    }, [isExpanded, hasActiveChild, activePath]);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isExpanded) {
            // Toggle accordion ketika sidebar expanded
            setIsOpen(prev => !prev);
        } else {
            // Get button position untuk secondary panel
            const buttonRect = e.currentTarget.getBoundingClientRect();
            
            // Panggil onAccordionClick untuk menampilkan secondary panel
            if (onAccordionClick) {
                onAccordionClick({ 
                    title, 
                    items: submenu, 
                    showWhenCollapsed: true,
                    position: {
                        top: buttonRect.top,
                        left: buttonRect.right + 5 // 5px gap dari sidebar
                    }
                });
            }
        }
    };

    return (
        <div>
            <button 
                onClick={handleClick}
                className={`flex items-center w-full h-12 text-white transition-colors duration-200 group relative hover:bg-white/10 ${
                    isExpanded ? 'pl-6 pr-4' : 'justify-center'
                } ${hasActiveChild ? 'bg-white/20' : ''}`}
                title={!isExpanded ? title : ''}
            >
                <div className={`absolute left-0 h-full w-1 bg-yellow-400 rounded-r-full transition-transform duration-300 ${
                    hasActiveChild ? 'scale-y-100' : 'scale-y-0'
                }`}></div>
                {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
                {isExpanded && (
                    <>
                        <span className="ml-4 font-medium whitespace-nowrap flex-1 text-left">{title}</span>
                        <span className={`transform transition-transform duration-300 text-sm ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                        }`}>▼</span>
                    </>
                )}
            </button>
            
            {/* Submenu container */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden bg-black/20 ${
                isOpen && isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                {submenu.map((item, index) => (
                    <NavLink 
                        key={item.path || index} 
                        to={item.path}
                        children={item.title}
                        activePath={activePath} 
                        isExpanded={isExpanded} 
                        isSubmenu={true}
                    />
                ))}
            </div>
        </div>
    );
};

AccordionMenu.propTypes = { 
    title: PropTypes.string.isRequired, 
    icon: PropTypes.string, 
    submenu: PropTypes.array.isRequired, 
    activePath: PropTypes.string.isRequired, 
    isExpanded: PropTypes.bool.isRequired, 
    onAccordionClick: PropTypes.func 
};

const Sidebar = ({ isExpanded, toggleSidebar, onAccordionClick }) => {
    const location = useLocation();

    return (
        <aside className={`bg-green-700 flex flex-col transition-all duration-300 ease-in-out relative ${
            isExpanded ? 'w-64' : 'w-20'
        }`}>
            {/* Header */}
            <div className={`flex items-center h-20 px-4 border-b border-white/10 ${
                isExpanded ? 'justify-start' : 'justify-center'
            }`}>
                <img 
                    src={isExpanded ? "/src/assets/logo-pegadaian-white.svg" : "../src/assets/Terndam.png"}
                    alt="logo" 
                    className={`transition-all duration-300 ${isExpanded ? 'h-10' : 'h-8'}`} 
                />
                {/* {isExpanded && <span className="ml-3 text-white font-bold text-lg">Pegadaian</span>} */}
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto pb-20">
                {menuItems.map((item, index) => {
                    // Render section headers
                    if (item.isMenuSection) {
                        return isExpanded ? (
                            <h3 
                                key={`section-${index}`} 
                                className="px-6 py-2 text-xs font-bold uppercase text-white/60 tracking-wider"
                            >
                                {item.title}
                            </h3>
                        ) : null;
                    }
                    
                    // Render accordion menus
                    if (item.submenu) {
                        return (
                            <AccordionMenu 
                                key={`accordion-${index}`} 
                                title={item.title}
                                icon={item.icon}
                                submenu={item.submenu}
                                activePath={location.pathname} 
                                isExpanded={isExpanded} 
                                onAccordionClick={onAccordionClick} 
                            />
                        );
                    }
                    
                    // Render regular nav links
                    return (
                        <NavLink 
                            key={`nav-${index}`} 
                            to={item.path}
                            icon={item.icon}
                            children={item.title}
                            activePath={location.pathname} 
                            isExpanded={isExpanded} 
                        />
                    );
                })}
            </nav>
            
            {/* Toggle Button - Positioned absolutely at bottom with some margin */}
            <div className="absolute bottom-4 left-0 right-0 p-2">
                <div className="flex justify-center">
                    <button 
                        onClick={toggleSidebar} 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
                        title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <span className={`transform transition-transform duration-300 text-lg ${
                            isExpanded ? 'rotate-0' : 'rotate-180'
                        }`}>
                            ❮
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

Sidebar.propTypes = { 
    isExpanded: PropTypes.bool.isRequired, 
    toggleSidebar: PropTypes.func.isRequired, 
    onAccordionClick: PropTypes.func 
};

export default Sidebar;