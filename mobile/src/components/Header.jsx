import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/customers': return 'Customers';
      case '/new': return 'New Entry';
      case '/settings': return 'Settings';
      default: return 'App';
    }
  };

  const showBack = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 safe-top z-40">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-600 dark:text-slate-300 active:scale-95 transition-transform"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
        )}
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          {getTitle()}
        </h1>
      </div>
      
      <button className="p-2 text-slate-600 dark:text-slate-300 active:scale-90 transition-transform relative">
        <Bell size={22} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
      </button>
    </header>
  );
};

export default Header;
