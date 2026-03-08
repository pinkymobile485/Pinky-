import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/dashboard/entry');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');
      const response = await axios.post(`${API_URL}/login`, { username, password });
      if (response.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard/entry');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 transition-colors duration-500 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500 rounded-full blur-[150px]"></div>
      </div>

      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-3 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 text-slate-500 transition-all hover:scale-110 active:scale-95"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-sm mb-4"></div>

      <div className="w-full max-w-sm bg-white dark:bg-[#0f172a]/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in relative z-10 transition-colors">
        <div className="p-6 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-600 to-rose-600 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-xl shadow-pink-500/20 transform -rotate-6">
              <span className="text-2xl font-black text-white italic">P</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white mb-1.5 tracking-tight transition-colors">Pinky Mobile</h1>
            <p className="text-slate-500 dark:text-pink-300/60 font-medium text-sm italic">Authorized Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 block">System Username</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                  <User className="h-4 w-4 text-slate-400 group-focus-within/input:text-pink-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all font-medium"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 block">Secure Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within/input:text-pink-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 dark:text-red-400 text-xs font-black text-center uppercase tracking-widest animate-shake">⚠ {error}</p>}

            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:shadow-2xl hover:shadow-pink-500/30 text-white rounded-xl font-black text-base transition-all duration-300 transform active:scale-95"
            >
              Secure Login
            </button>
          </form>
        </div>
        <div className="px-8 py-3 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 text-center">
          <p className="text-[9px] text-slate-400 dark:text-pink-200/40 font-black uppercase tracking-[0.3em]">Encrypted Session Active</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
