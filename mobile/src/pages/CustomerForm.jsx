import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash2, X } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    modelName: '',
    problemDescription: '',
    devicePassword: '',
    approximateAmount: '',
    attenderName: '',
    entryDate: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        try {
          const res = await api.get(`/customers/${id}`);
          setFormData(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCustomer();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.patch(`/customers/${id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      navigate('/customers');
    } catch (err) {
      console.error(err);
      alert('Error saving customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this record?')) {
      try {
        await api.delete(`/customers/${id}`);
        navigate('/customers');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Customer Name</label>
          <input
            required
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary h-14"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
          <input
            required
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary h-14"
            placeholder="e.g. 9876543210"
            type="tel"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Model</label>
            <input
              name="modelName"
              value={formData.modelName}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary h-14"
              placeholder="iPhone 13"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input
              name="devicePassword"
              value={formData.devicePassword}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary h-14"
              placeholder="1234"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Problem</label>
          <textarea
            name="problemDescription"
            value={formData.problemDescription}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary min-h-[100px]"
            placeholder="Describe the issue..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Estimate</label>
            <input
              name="approximateAmount"
              value={formData.approximateAmount}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary h-14"
              placeholder="₹ 0.00"
              type="number"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Date</label>
            <input
              name="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary h-14"
              type="date"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary h-14 appearance-none"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        {id && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-2xl p-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Trash2 size={20} />
            Delete
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] bg-primary text-white rounded-2xl p-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-primary/30"
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
