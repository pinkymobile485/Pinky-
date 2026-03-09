import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Phone, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const colors = {
    'Pending': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Delivery': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status] || colors.Pending}`}>
      {status}
    </span>
  );
};

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c => 
    c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search) ||
    c.modelName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          placeholder="Search by name, phone or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Pending', 'Completed', 'Delivery'].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading customers...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400">No customers found</div>
          ) : (
            filtered.map((customer, index) => (
              <motion.div
                key={customer._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/edit/${customer._id}`}
                  className="block bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                      {customer.customerName}
                    </h3>
                    <StatusBadge status={customer.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      {customer.phoneNumber}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar size={14} />
                      {customer.entryDate || 'N/A'}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-medium text-primary">
                      {customer.modelName}
                    </span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerList;
