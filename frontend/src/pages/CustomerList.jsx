import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Table, LayoutGrid, Eye, Search, Phone, User, Monitor, ChevronRight, X, IndianRupee, Lock, Star, Download, FileText, Trash2, Edit3, CheckCircle2, Clock, Truck, Sparkles, RefreshCw, CalendarDays, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [viewMode, setViewMode] = useState('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Export filter state
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const exportMenuRef = useRef(null);

    useEffect(() => {
        fetchCustomers();
        // Close export menu on outside click
        const handler = (e) => { if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) setShowExportMenu(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchCustomers = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/customers`);
            setCustomers(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); setRefreshing(false); }
    };

    const editCustomer = async (e) => {
        e.preventDefault();
        if (!editingCustomer.customerName || !editingCustomer.phoneNumber) { alert('Name and Phone are required!'); return; }
        try {
            const { _id, ...data } = editingCustomer;
            const res = await axios.patch(`${API_BASE_URL}/customers/${_id}`, data);
            setCustomers(prev => prev.map(c => c._id === _id ? res.data : c));
            if (selectedCustomer?._id === _id) setSelectedCustomer(res.data);
            setEditingCustomer(null);
        } catch (err) {
            alert('Update failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const deleteCustomer = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/customers/${id}`);
            setCustomers(prev => prev.filter(c => c._id !== id));
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await axios.patch(`${API_BASE_URL}/customers/${id}`, { status });
            setCustomers(prev => prev.map(c => c._id === id ? res.data : c));
            if (selectedCustomer?._id === id) setSelectedCustomer(res.data);
        } catch (err) { console.error(err); }
    };

    const exportPDF = (customer) => {
        const doc = new jsPDF();
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20); doc.setFont('helvetica', 'bold');
        doc.text('SERVICE REPORT', 20, 25);
        doc.setFontSize(9);
        doc.text(`${new Date().toLocaleString()}`, 135, 25);
        doc.setTextColor(0, 0, 0);
        autoTable(doc, {
            startY: 50,
            head: [['Field', 'Details']],
            body: [
                ['Customer Name', customer.customerName],
                ['Phone', customer.phoneNumber],
                ['Device Model', customer.modelName],
                ['Password', customer.devicePassword || 'N/A'],
                ['Est. Amount', `Rs. ${customer.approximateAmount}`],
                ['Attended Value', customer.attendedValue],
                ['Status', customer.status || 'Pending'],
                ['Problem', customer.problemDescription],
            ],
            theme: 'striped',
            headStyles: { fillColor: [219, 39, 119] },
            margin: { left: 20, right: 20 },
        });
        doc.save(`${customer.customerName}_Report.pdf`);
    };

    /* ── Date filter helpers ── */
    const getDateRange = (preset) => {
        const now = new Date();
        const start = new Date();
        if (preset === 'today') {
            start.setHours(0, 0, 0, 0);
        } else if (preset === 'week') {
            start.setDate(now.getDate() - 7);
            start.setHours(0, 0, 0, 0);
        } else if (preset === 'month') {
            start.setMonth(now.getMonth() - 1);
            start.setHours(0, 0, 0, 0);
        } else if (preset === 'year') {
            start.setFullYear(now.getFullYear() - 1);
            start.setHours(0, 0, 0, 0);
        }
        return { start, end: now };
    };

    const exportAllPDF = (dataToExport, label = 'All Records') => {
        if (!dataToExport.length) { alert('No records found for this date range.'); return; }
        const doc = new jsPDF();
        // Header bar
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 210, 38, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16); doc.setFont('helvetica', 'bold');
        doc.text('PINKY MOBILE — Customer Registry', 14, 16);
        doc.setFontSize(9); doc.setFont('helvetica', 'normal');
        doc.text(`Filter: ${label}`, 14, 27);
        doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 130, 27);
        doc.setTextColor(0, 0, 0);
        autoTable(doc, {
            startY: 46,
            head: [['#', 'Customer', 'Phone', 'Model', 'Status', 'Amount', 'Date']],
            body: dataToExport.map((c, i) => [
                i + 1,
                c.customerName,
                c.phoneNumber,
                c.modelName,
                c.status || 'Pending',
                `Rs. ${c.approximateAmount}`,
                c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—',
            ]),
            theme: 'grid',
            headStyles: { fillColor: [219, 39, 119], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [252, 231, 243] },
            margin: { left: 14, right: 14 },
        });
        doc.save(`Customer_List_${label.replace(/\s+/g, '_')}.pdf`);
        setShowExportMenu(false);
    };

    const handlePresetExport = (preset, label) => {
        const { start, end } = getDateRange(preset);
        const filtered = customers.filter(c => {
            if (!c.createdAt) return preset === 'all';
            const d = new Date(c.createdAt);
            return d >= start && d <= end;
        });
        exportAllPDF(filtered, label);
    };

    const handleCustomExport = () => {
        if (!customStart || !customEnd) { alert('Please select both start and end dates.'); return; }
        const start = new Date(customStart); start.setHours(0, 0, 0, 0);
        const end   = new Date(customEnd);   end.setHours(23, 59, 59, 999);
        if (start > end) { alert('Start date must be before end date.'); return; }
        const filtered = customers.filter(c => {
            if (!c.createdAt) return false;
            const d = new Date(c.createdAt);
            return d >= start && d <= end;
        });
        const label = `${new Date(customStart).toLocaleDateString('en-IN')} to ${new Date(customEnd).toLocaleDateString('en-IN')}`;
        exportAllPDF(filtered, label);
    };


    const filteredCustomers = customers.filter(c =>
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phoneNumber.includes(searchTerm) ||
        c.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.status && c.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed': return { cls: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
            case 'Delivery':  return { cls: 'bg-pink-500/15 text-pink-500 border-pink-500/30',          icon: <Truck className="w-3.5 h-3.5" /> };
            default:          return { cls: 'bg-amber-500/15 text-amber-500 border-amber-500/30',        icon: <Clock className="w-3.5 h-3.5" /> };
        }
    };

    /* ═══════════════════════════════════
       VIEW CASE MODAL
    ═══════════════════════════════════ */
    const DetailModal = () => {
        if (!selectedCustomer) return null;
        const badge = getStatusBadge(selectedCustomer.status || 'Pending');

        const heroBg = {
            Pending:   'from-amber-400 to-orange-500',
            Completed: 'from-emerald-400 to-teal-600',
            Delivery:  'from-pink-500 to-rose-600',
        }[selectedCustomer.status || 'Pending'];

        const statusActiveCls = {
            Pending:   'bg-gradient-to-br from-amber-400 to-orange-500 border-transparent text-white shadow-lg shadow-amber-400/30',
            Completed: 'bg-gradient-to-br from-emerald-400 to-teal-600 border-transparent text-white shadow-lg shadow-emerald-400/30',
            Delivery:  'bg-gradient-to-br from-pink-500 to-rose-600 border-transparent text-white shadow-lg shadow-pink-500/30',
        };

        return (
            <div className="fixed inset-0 z-[200] flex items-start justify-center" style={{ padding: '1.5rem', paddingTop: '10vh' }}>

                {/* Animated CSS keyframes */}
                <style>{`
                    @keyframes backdropIn {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                    }
                    @keyframes modalIn {
                        from { opacity: 0; transform: scale(0.88) translateY(28px); }
                        to   { opacity: 1; transform: scale(1)    translateY(0); }
                    }
                `}</style>

                {/* Animated backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-lg"
                    style={{ animation: 'backdropIn 0.25s ease-out both' }}
                    onClick={() => setSelectedCustomer(null)}
                />

                {/* Modal card — curved corners + pop-in animation */}
                <div
                    className="relative z-10 w-full bg-white dark:bg-[#0f172a] rounded-3xl shadow-[0_30px_80px_-8px_rgba(0,0,0,0.5)] border border-slate-200/60 dark:border-slate-700/60 flex flex-col"
                    style={{ maxWidth: '480px', maxHeight: '88vh', animation: 'modalIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both' }}
                >
                    {/* ── Sticky header always visible ── */}
                    <div className={`bg-gradient-to-br ${heroBg} rounded-t-3xl px-5 py-5 flex-shrink-0 relative overflow-hidden`}>
                        {/* Decorative blobs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
                        <div className="absolute bottom-0 left-12 w-16 h-16 rounded-full bg-black/10 translate-y-1/2 pointer-events-none" />

                        {/* Top row: status pill + actions */}
                        <div className="flex items-center justify-between mb-4 relative">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
                                {badge.icon} {selectedCustomer.status || 'Pending'}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => exportPDF(selectedCustomer)} title="Export PDF"
                                    className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90">
                                    <FileText className="w-4 h-4" />
                                </button>
                                <button onClick={() => setSelectedCustomer(null)}
                                    className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-90">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Avatar + Name */}
                        <div className="flex items-center gap-4 relative">
                            <div className="w-14 h-14 rounded-2xl bg-white/25 border-2 border-white/40 flex items-center justify-center shadow-xl flex-shrink-0">
                                <span className="text-2xl font-black text-white italic">{selectedCustomer.customerName[0]}</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white leading-tight">{selectedCustomer.customerName}</h2>
                                <p className="flex items-center gap-1.5 text-white/80 text-sm font-medium mt-0.5">
                                    <Phone className="w-3.5 h-3.5" /> {selectedCustomer.phoneNumber}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Scrollable body ── */}
                    <div className="overflow-y-auto flex-1 p-5 space-y-4">

                        {/* Status switcher */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Change Status</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { val: 'Pending',   Ic: Clock,        label: 'Pending'   },
                                    { val: 'Completed', Ic: CheckCircle2, label: 'Completed' },
                                    { val: 'Delivery',  Ic: Truck,        label: 'Delivery'  },
                                ].map(({ val, Ic, label }) => {
                                    const active = (selectedCustomer.status || 'Pending') === val;
                                    return (
                                        <button key={val} onClick={() => updateStatus(selectedCustomer._id, val)}
                                            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all duration-200 active:scale-95 ${
                                                active
                                                    ? statusActiveCls[val]
                                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-pink-400 hover:text-pink-500 hover:scale-105'
                                            }`}>
                                            <Ic className="w-4 h-4" /> {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Info cards */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: Monitor,     label: 'Device Model', value: selectedCustomer.modelName,                grad: 'from-pink-500 to-rose-500' },
                                { icon: Lock,        label: 'Password',     value: selectedCustomer.devicePassword || 'None', grad: 'from-violet-500 to-purple-600' },
                                { icon: IndianRupee, label: 'Est. Amount',  value: `₹${selectedCustomer.approximateAmount}`,  grad: 'from-emerald-400 to-teal-500' },
                                { icon: Star,        label: 'Priority',     value: selectedCustomer.attendedValue || '—',     grad: 'from-amber-400 to-orange-500' },
                            ].map(({ icon: Ic, label, value, grad }) => (
                                <div key={label} className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 p-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-2 shadow`}>
                                        <Ic className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Problem */}
                        <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-pink-500 to-rose-500" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Problem Description</p>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic break-words">
                                "{selectedCustomer.problemDescription}"
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-1">
                            <button onClick={() => { setSelectedCustomer(null); setEditingCustomer(selectedCustomer); }}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-amber-400/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-amber-400/35 active:scale-95">
                                <Edit3 className="w-4 h-4" /> Edit Record
                            </button>
                            <button onClick={() => setSelectedCustomer(null)}
                                className="px-5 flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-300 py-3 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:scale-105 active:scale-95">
                                <X className="w-4 h-4" /> Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    /* ═══════════════════════════════════
       EDIT MODAL
    ═══════════════════════════════════ */
    const EditModal = () => {
        if (!editingCustomer) return null;

        const fields = [
            { key: 'customerName',     label: 'Customer Name',   icon: User,        type: 'text' },
            { key: 'phoneNumber',      label: 'Phone Number',    icon: Phone,       type: 'tel' },
            { key: 'modelName',        label: 'Device Model',    icon: Monitor,     type: 'text' },
            { key: 'devicePassword',   label: 'Device Password', icon: Lock,        type: 'text' },
            { key: 'approximateAmount', label: 'Estimate (₹)',   icon: IndianRupee, type: 'number' },
            { key: 'attendedValue',    label: 'Attended Value',  icon: Star,        type: 'text' },
        ];

        const statusOpts = [
            { val: 'Pending',   Ic: Clock,        grad: 'from-amber-400 to-orange-500',  shadow: 'shadow-amber-400/30'   },
            { val: 'Completed', Ic: CheckCircle2, grad: 'from-emerald-400 to-teal-600',  shadow: 'shadow-emerald-400/30' },
            { val: 'Delivery',  Ic: Truck,        grad: 'from-pink-500 to-rose-600',     shadow: 'shadow-pink-500/30'    },
        ];

        return (
            <div className="fixed inset-0 z-[200] flex items-start justify-center" style={{ padding: '1.5rem', paddingTop: '10vh' }}>

                {/* Animated CSS keyframes */}
                <style>{`
                    @keyframes backdropIn  { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes modalSlideIn {
                        from { opacity: 0; transform: scale(0.88) translateY(28px); }
                        to   { opacity: 1; transform: scale(1)    translateY(0); }
                    }
                `}</style>

                {/* Animated backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-lg"
                    style={{ animation: 'backdropIn 0.25s ease-out both' }}
                    onClick={() => setEditingCustomer(null)}
                />

                {/* Modal card */}
                <div
                    className="relative z-10 w-full bg-white dark:bg-[#0f172a] rounded-3xl shadow-[0_30px_80px_-8px_rgba(0,0,0,0.5)] border border-slate-200/60 dark:border-slate-700/60 flex flex-col"
                    style={{ maxWidth: '460px', maxHeight: '90vh', animation: 'modalSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both' }}
                >
                    {/* ── Sticky header ── */}
                    <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 rounded-t-3xl px-5 py-5 flex-shrink-0 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
                        <div className="flex items-center justify-between relative">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/25 border border-white/40 flex items-center justify-center">
                                    <Edit3 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Editing Customer</p>
                                    <h3 className="text-base font-black text-white truncate" style={{ maxWidth: '220px' }}>{editingCustomer.customerName}</h3>
                                </div>
                            </div>
                            <button type="button" onClick={() => setEditingCustomer(null)}
                                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-90">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* ── Scrollable form ── */}
                    <form onSubmit={editCustomer} className="overflow-y-auto flex-1 p-5 space-y-4">

                        {/* Input fields */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                            {fields.map(({ key, label, icon: Ic, type }) => (
                                <div key={key} className="group/f">
                                    <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-focus-within/f:text-pink-500 transition-colors">
                                        <Ic className="w-3 h-3" /> {label}
                                    </label>
                                    <input
                                        type={type}
                                        value={editingCustomer[key] || ''}
                                        onChange={e => setEditingCustomer({ ...editingCustomer, [key]: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all hover:border-pink-300 dark:hover:border-pink-700 placeholder-slate-300 dark:placeholder-slate-600"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Status */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Service Status</p>
                            <div className="grid grid-cols-3 gap-2">
                                {statusOpts.map(({ val, Ic, grad, shadow }) => {
                                    const active = (editingCustomer.status || 'Pending') === val;
                                    return (
                                        <button type="button" key={val}
                                            onClick={() => setEditingCustomer({ ...editingCustomer, status: val })}
                                            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all duration-200 active:scale-95 ${
                                                active
                                                    ? `bg-gradient-to-br ${grad} text-white border-transparent shadow-lg ${shadow} scale-105`
                                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-pink-400 hover:text-pink-500 hover:scale-105'
                                            }`}>
                                            <Ic className="w-4 h-4" /> {val}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Problem textarea */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Problem Description</label>
                            <textarea
                                value={editingCustomer.problemDescription || ''}
                                onChange={e => setEditingCustomer({ ...editingCustomer, problemDescription: e.target.value })}
                                rows="3"
                                placeholder="Describe the device issue..."
                                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 resize-none outline-none transition-all hover:border-pink-300 dark:hover:border-pink-700 placeholder-slate-300 dark:placeholder-slate-600 leading-relaxed"
                            />
                        </div>

                        {/* Submit row */}
                        <div className="flex gap-3 pb-1">
                            <button type="submit"
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white py-3 rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg shadow-pink-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-pink-500/35 hover:scale-105 active:scale-95">
                                <CheckCircle2 className="w-4 h-4" /> Update Record
                            </button>
                            <button type="button" onClick={() => setEditingCustomer(null)}
                                className="px-4 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-300 py-3 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:scale-105 active:scale-95">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        );
    };

    /* ═══════════════════════════════════
       MAIN PAGE
    ═══════════════════════════════════ */
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Page header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full" />
                        <span className="text-xs font-black text-pink-500 uppercase tracking-[0.2em]">Management</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Customer List</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
                        Real‑time overview of all service requests.
                        <span className="inline-flex items-center gap-1 text-pink-500 font-bold bg-pink-50 dark:bg-pink-500/10 px-2 py-0.5 rounded-full text-xs border border-pink-200 dark:border-pink-500/20">
                            <Sparkles className="w-3 h-3" /> {customers.length}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    {/* ── Export PDF with date filter dropdown ── */}
                    <div className="relative" ref={exportMenuRef}>
                        <button
                            onClick={() => setShowExportMenu(v => !v)}
                            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:border-pink-400 hover:text-pink-600 hover:shadow-lg hover:shadow-pink-500/10 transition-all active:scale-95 text-sm"
                        >
                            <Download className="w-4 h-4" /> Export PDF <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showExportMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showExportMenu && (
                            <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                                style={{ animation: 'modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}>

                                {/* Preset filters */}
                                <div className="p-3 space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 pb-1">Quick Filters</p>
                                    {[
                                        { label: '📅 Today',      preset: 'today' },
                                        { label: '📆 Last Week',  preset: 'week'  },
                                        { label: '🗓️ Last Month', preset: 'month' },
                                        { label: '📊 Last Year',  preset: 'year'  },
                                        { label: '📋 All Records', preset: 'all'  },
                                    ].map(({ label, preset }) => (
                                        <button key={preset}
                                            onClick={() => {
                                                if (preset === 'all') exportAllPDF(customers, 'All Records');
                                                else handlePresetExport(preset, label.replace(/^.\s/, ''));
                                            }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-150 flex items-center gap-2"
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="mx-3 border-t border-slate-100 dark:border-slate-800" />

                                {/* Custom date range */}
                                <div className="p-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Custom Range</p>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 ml-1">Start Date</label>
                                            <input type="date"
                                                value={customStart}
                                                onChange={e => setCustomStart(e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 ml-1">End Date</label>
                                            <input type="date"
                                                value={customEnd}
                                                onChange={e => setCustomEnd(e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                                            />
                                        </div>
                                        <button onClick={handleCustomExport}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white py-2.5 rounded-xl text-sm font-black uppercase tracking-wider shadow-lg shadow-pink-500/25 transition-all hover:scale-105 active:scale-95">
                                            <CalendarDays className="w-4 h-4" /> Export Range
                                        </button>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                    <button onClick={() => fetchCustomers(true)}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:border-pink-400 hover:shadow-lg transition-all active:scale-95 text-sm">
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                    </button>

                    <div className="relative group flex-1 md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                        <input type="text" placeholder="Search customers..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-600" />
                    </div>

                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 p-1 rounded-xl flex gap-1 shadow-sm">
                        {[['table', Table], ['card', LayoutGrid]].map(([mode, Icon]) => (
                            <button key={mode} onClick={() => setViewMode(mode)}
                                className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === mode ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30 scale-105' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'}`}>
                                <Icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content area */}
            {loading ? (
                <div className="flex flex-col justify-center items-center py-40 gap-4">
                    <div className="w-14 h-14 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm animate-pulse">Loading customers...</p>
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-lg text-slate-400 font-bold italic">No records found{searchTerm && ` for "${searchTerm}"`}</p>
                    {searchTerm && <button onClick={() => setSearchTerm('')} className="text-pink-500 text-sm font-bold hover:underline">Clear search</button>}
                </div>

            ) : viewMode === 'table' ? (
                /* TABLE VIEW */
                <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    {['Customer', 'Device Model', 'Problem', 'Status', 'Actions'].map(h => (
                                        <th key={h} className={`px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest ${h === 'Problem' ? 'hidden lg:table-cell' : ''} ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredCustomers.map((c) => {
                                    const badge = getStatusBadge(c.status || 'Pending');
                                    return (
                                        <tr key={c._id} className="hover:bg-pink-500/5 group transition-all duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-pink-600 font-black group-hover:bg-pink-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 italic text-base flex-shrink-0">
                                                        {c.customerName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white group-hover:text-pink-600 transition-colors text-sm">{c.customerName}</p>
                                                        <p className="text-slate-400 text-xs mt-0.5">{c.phoneNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Monitor className="w-3.5 h-3.5 text-pink-400" />
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{c.modelName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell text-xs text-slate-400 italic max-w-[160px] truncate">{c.problemDescription}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase ${badge.cls}`}>
                                                    {badge.icon} {c.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => setSelectedCustomer(c)} title="View"
                                                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-pink-600 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20 active:scale-90 border border-transparent hover:border-pink-500">
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => setEditingCustomer(c)} title="Edit"
                                                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-500 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-amber-500/20 active:scale-90 border border-transparent hover:border-amber-400">
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => deleteCustomer(c._id)} title="Delete"
                                                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-500 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 active:scale-90 border border-transparent hover:border-red-400">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-3 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-xs text-slate-400">
                            Showing <span className="text-pink-500 font-bold">{filteredCustomers.length}</span> of <span className="font-bold">{customers.length}</span> records
                        </span>
                        <span className="text-xs text-slate-400 italic">Pinky Mobile · Service Management</span>
                    </div>
                </div>

            ) : (
                /* CARD VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCustomers.map((c) => {
                        const badge = getStatusBadge(c.status || 'Pending');
                        return (
                            <div key={c._id}
                                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-pink-400 dark:hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-400 flex flex-col group shadow-lg hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-pink-600/10 flex items-center justify-center text-pink-600 font-black text-xl italic group-hover:bg-pink-600 group-hover:text-white group-hover:scale-110 transition-all duration-400">
                                        {c.customerName[0]}
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase ${badge.cls}`}>
                                        {badge.icon} {c.status || 'Pending'}
                                    </span>
                                </div>
                                <h3 className="text-base font-black text-slate-800 dark:text-white mb-1 group-hover:text-pink-600 transition-colors">{c.customerName}</h3>
                                <p className="text-slate-400 text-xs mb-4 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5" /> {c.phoneNumber}
                                </p>
                                <div className="flex-1 space-y-2 mb-4">
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                                        <Monitor className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{c.modelName}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 italic line-clamp-2 px-1">"{c.problemDescription}"</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setSelectedCustomer(c)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-pink-600 text-slate-600 dark:text-slate-300 hover:text-white py-2.5 rounded-xl font-bold text-xs transition-all hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 active:scale-95">
                                        <Eye className="w-3.5 h-3.5" /> View <ChevronRight className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => setEditingCustomer(c)}
                                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 text-slate-500 hover:text-white transition-all hover:scale-110 active:scale-90">
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => deleteCustomer(c._id)}
                                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500 text-slate-500 hover:text-white transition-all hover:scale-110 active:scale-90">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <DetailModal />
            <EditModal />
        </div>
    );
};

export default CustomerList;
