import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Package, TrendingUp } from 'lucide-react';
import api from '../api/axios';

const StatCard = ({ icon, label, value, color }) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ pending: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/customers');
        const data = res.data;
        const pending = data.filter(c => c.status === 'Pending').length;
        const completed = data.filter(c => c.status === 'Completed' || c.status === 'Delivery').length;
        setStats({
          pending,
          completed,
          total: data.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back!</h2>
        <p className="text-slate-500 dark:text-slate-400">Here's what's happening today.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <StatCard 
          icon={<Clock className="text-orange-600" size={24} />} 
          label="Pending Repairs" 
          value={loading ? '...' : stats.pending} 
          color="bg-orange-50 dark:bg-orange-900/20"
        />
        <StatCard 
          icon={<CheckCircle className="text-emerald-600" size={24} />} 
          label="Completed Today" 
          value={loading ? '...' : stats.completed} 
          color="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard 
          icon={<Package className="text-blue-600" size={24} />} 
          label="Total Entries" 
          value={loading ? '...' : stats.total} 
          color="bg-blue-50 dark:bg-blue-900/20"
        />
      </div>

      <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-3xl text-white shadow-lg shadow-primary/20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold opacity-90">Performance</h3>
            <p className="text-3xl font-black mt-1">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% 
            </p>
            <p className="text-sm opacity-75 mt-1">Success Rate</p>
          </div>
          <TrendingUp size={32} className="opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
