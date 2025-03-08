import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiHome, FiFeather, FiRefreshCw, FiBook, FiLayout, FiBookOpen, FiMenu, FiActivity, FiCpu, FiUsers } from 'react-icons/fi';
import { useSidebar } from '../../context/SidebarContext';
import GradientLogo from '../common/GradientLogo';

const navItems = [
  { icon: <FiHome />, text: 'Overview', path: '/dashboard' },
  { icon: <FiUsers />, text: 'Brand Voices', path: '/dashboard/brand-voices' },
  { icon: <FiFeather />, text: 'Content Generation', path: '/dashboard/generation' },
  { icon: <FiRefreshCw />, text: 'Content Revival', path: '/dashboard/revival' },
  { icon: <FiBook />, text: 'Content Library', path: '/dashboard/library' },
  { icon: <FiCpu />, text: 'Content Ideas', path: '/dashboard/ideas' },
  { icon: <FiLayout />, text: 'Templates', path: '/dashboard/templates' },
  { icon: <FiBookOpen />, text: 'Hooks Library', path: '/dashboard/hooks' },
  { icon: <FiActivity />, text: 'Token History', path: '/dashboard/tokens' },
];

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  return (
    <div 
      className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        h-screen bg-white border-r border-gray-200 
        fixed left-0 top-0 transition-all duration-300 
        flex flex-col z-40
        transform sm:translate-x-0
        ${isCollapsed ? '-translate-x-full sm:translate-x-0' : 'translate-x-0'}
      `}
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 sm:p-6`}>
        <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100'}`}>
          <Link to="/dashboard">
            <GradientLogo />
          </Link>
        </div>
        <button 
          onClick={toggleSidebar}
          className={`p-2 hover:bg-gray-100 rounded-lg ${isCollapsed ? 'w-10 h-10 flex items-center justify-center' : ''}`}
        >
          <FiMenu className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-6'} py-3 text-gray-600 hover:bg-gray-50 hover:text-primary ${
                isActive ? 'text-primary bg-primary/5 border-r-2 border-primary' : ''
              }`
            }
          >
            <div className={`${isCollapsed ? 'w-10 flex justify-center' : ''}`}>
              {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
            </div>
            {!isCollapsed && <span className="text-sm">{item.text}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}