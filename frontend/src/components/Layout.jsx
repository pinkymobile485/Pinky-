import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 w-full h-14 lg:h-16 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 px-4 lg:px-8 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-600 shadow-xl shadow-pink-500/20 flex items-center justify-center">
                <span className="text-sm font-black text-white italic">P</span>
              </div>
              <div className="hidden md:block">
                <h2 className="text-sm font-bold tracking-tight leading-none uppercase">Pinky Mobile</h2>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 lg:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 transform active:scale-95"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=Admin&background=random&color=fff`} alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
