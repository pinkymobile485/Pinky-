import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlusCircle, Users, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Entry', icon: PlusCircle, path: '/dashboard/entry' },
    { name: 'Customer', icon: Users, path: '/dashboard/customers' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-56 transform transition-all duration-300 ease-in-out
        bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-[#1e293b]
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-none'}
      `}>
        <div className="p-5 border-b border-slate-200 dark:border-[#1e293b] flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent tracking-tight italic">Pinky Mobile</h1>
          <button onClick={toggleSidebar} className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <nav className="flex-1 p-3 space-y-1.5 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => { if(window.innerWidth < 1024) toggleSidebar(); }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive 
                    ? 'bg-pink-600/10 text-pink-600 dark:bg-pink-600/20 dark:text-pink-400 border border-pink-500/10 dark:border-pink-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="h-4 w-4 mr-3 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-[#1e293b] mt-auto">
          <button 
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              window.location.href = '/';
            }}
            className="flex items-center w-full px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group"
          >
            <LogOut className="h-4 w-4 mr-3 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wide">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
