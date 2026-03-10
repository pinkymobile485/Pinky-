import React, { useState } from 'react';
import axios from 'axios';
import { User, Phone, Laptop, ClipboardList, Lock, IndianRupee, Star, CheckCircle2, PlusCircle, Calendar } from 'lucide-react';

const EntryForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        phoneNumber: '',
        modelName: '',
        problemDescription: '',
        devicePassword: '',
        approximateAmount: '',
        attenderName: '',
        entryDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');
            await axios.post(`${API_URL}/customers`, formData);
            setSuccess(true);
            setFormData({
                customerName: '',
                phoneNumber: '',
                modelName: '',
                problemDescription: '',
                devicePassword: '',
                approximateAmount: '',
                attenderName: '',
                entryDate: ''
            });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Submit Error:', err);
            const errMsg = err.response?.data?.error || err.message || 'Unknown network error';
            alert(`Failed to register customer!\n\nReason: ${errMsg}\n\nPlease check Vercel Environment Variables & MongoDB Atlas IP Access.`);
        } finally {
            setLoading(false);
        }
    };

    const inputFields = [
        { id: 'customerName', label: 'Customer Name', icon: User, type: 'text', placeholder: '' },
        { id: 'phoneNumber', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '' },
        { id: 'modelName', label: 'Model Name', icon: Laptop, type: 'text', placeholder: '' },
        { id: 'devicePassword', label: 'Device Password', icon: Lock, type: 'text', placeholder: '' },
        { id: 'approximateAmount', label: 'Approximate Amount', icon: IndianRupee, type: 'number', placeholder: '' },
        { id: 'attenderName', label: 'Attender Name', icon: Star, type: 'text', placeholder: '' },
        { id: 'entryDate', label: 'Entry Date', icon: Calendar, type: 'date', placeholder: '' }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-6 flex flex-col items-start gap-3">
                <div className="flex items-center gap-2 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20">
                    <PlusCircle className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span className="text-pink-600 dark:text-pink-400 font-bold text-[10px] uppercase tracking-widest">New Service Request</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white transition-colors">Customer Entry</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-base max-w-2xl">Register a new device service entry with all necessary details for processing.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 bg-white dark:bg-[#0f172a] p-5 lg:p-7 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 dark:bg-pink-600/5 rounded-full blur-[100px] pointer-events-none"></div>

                {inputFields.map((field) => (
                    <div key={field.id} className="space-y-2 relative">
                        <label className="text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider ml-1 block">{field.label}</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-transform duration-300 group-focus-within/input:scale-110">
                                <field.icon className="h-4 w-4 text-slate-400 group-focus-within/input:text-pink-500 transition-colors" />
                            </div>
                            <input
                                required
                                type={field.type}
                                name={field.id}
                                value={formData[field.id]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300"
                            />
                        </div>
                    </div>
                ))}

                <div className="col-span-full space-y-2">
                    <label className="text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider ml-1 block">Problem Description</label>
                    <div className="relative group/textarea">
                        <div className="absolute top-3.5 left-4 pointer-events-none">
                            <ClipboardList className="h-4 w-4 text-slate-400 group-focus-within/textarea:text-pink-500 transition-colors" />
                        </div>
                        <textarea
                            required
                            name="problemDescription"
                            rows="3"
                            value={formData.problemDescription}
                            onChange={handleChange}
                            placeholder="Please describe the device issues..."
                            className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300 resize-none"
                        ></textarea>
                    </div>
                </div>

                <div className="col-span-full flex flex-col sm:flex-row items-center justify-between gap-6 mt-4">
                    {success ? (
                        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 px-6 py-4 rounded-2xl border border-emerald-200 dark:border-emerald-400/20 animate-bounce w-full sm:w-auto">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="font-bold italic">Requirement Saved Successfully!</span>
                        </div>
                    ) : <div className="hidden sm:block"></div>}
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:shadow-2xl hover:shadow-pink-500/40 text-white rounded-xl font-black text-sm transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Complete Registration</span>
                                <PlusCircle className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-500" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EntryForm;
