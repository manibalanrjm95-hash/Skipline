import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Users, ShoppingCart, TrendingUp, Clock, AlertCircle, Zap, ChevronRight, Loader2, QrCode, ShieldCheck, LogOut, Menu, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
    const { products, updateOrderStatus, STATUS, loading } = useStore();
    const [liveOrders, setLiveOrders] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, count: 0 });
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { addToast } = useToast();

    const fetchLiveOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .in('status', [STATUS.PENDING_PAYMENT, STATUS.AWAITING_VERIFICATION, STATUS.VERIFIED])
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLiveOrders(data || []);

            // Calculate basic stats for today
            const today = new Date().toISOString().split('T')[0];
            const { data: todayData } = await supabase
                .from('orders')
                .select('total_amount')
                .gte('created_at', today)
                .in('status', [STATUS.VERIFIED, STATUS.EXITED]);

            if (todayData) {
                const revenue = todayData.reduce((acc, o) => acc + o.total_amount, 0);
                setStats({ revenue, count: todayData.length });
            }
        } catch (err) {
            console.error('Fetch live orders error:', err);
        }
    };

    useEffect(() => {
        fetchLiveOrders();
        const interval = setInterval(fetchLiveOrders, 5000); // 5s Polling for V1
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (orderId, newStatus) => {
        setRefreshLoading(true);
        await updateOrderStatus(orderId, newStatus);

        if (newStatus === STATUS.VERIFIED) addToast(`Order #${orderId.slice(-4)} verified`, 'success');
        if (newStatus === STATUS.CANCELLED) addToast(`Order #${orderId.slice(-4)} cancelled`, 'error');
        if (newStatus === STATUS.EXITED) addToast(`Order #${orderId.slice(-4)} cleared for exit`, 'success');

        await fetchLiveOrders();
        setRefreshLoading(false);
    };

    if (loading) {
        return (
            <div className="flex bg-grey-50 min-h-screen">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="ml-64 flex-1 p-10 animate-fade admin-content">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <div className="grid grid-cols-4 gap-6 mb-10">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-[32px]" />)}
                    </div>
                </div>
            </div>
        );
    }

    const metrics = [
        { label: 'Live Orders', value: liveOrders.length.toString(), icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
        { label: "Today's Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-success', bg: 'bg-success-bg' },
        { label: 'Total Verified', value: stats.count.toString(), icon: ShieldCheck, color: 'text-secondary', bg: 'bg-secondary/10' },
        { label: 'Low Stock Items', value: products.filter(p => p.stock < 10).length.toString(), icon: AlertCircle, color: 'text-warning', bg: 'bg-warning-bg' },
    ];

    return (
        <div className="admin-layout flex min-h-screen relative overflow-hidden bg-grey-50">
            {/* Helixion V4 Mesh Background */}
            <div className="mesh-bg"></div>

            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="ml-64 flex-1 p-10 animate-fade-in relative z-10">
                {/* Header */}
                <div className="flex justify-between items-end mb-12 flex-col-mobile gap-4">
                    <div className="flex items-center gap-6 w-full">
                        <button
                            className="lg:hidden p-4 bg-white rounded-2xl shadow-lg text-grey-600 magnetic-btn"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="animate-slide-up">
                            <p className="caption text-primary mb-1 tracking-[0.3em] font-black">COMMAND CENTER</p>
                            <h1 className="text-display text-grey-900 leading-tight font-black">Overview</h1>
                        </div>

                        <div className="ml-auto flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-3 px-5 py-2.5 glass-card shadow-lg border-white/50">
                                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_10px_var(--success)]"></span>
                                <span className="text-xs font-black text-grey-700 uppercase tracking-widest">System Online</span>
                            </div>
                            <div className="px-5 py-2.5 glass-card shadow-lg border-white/50 text-xs font-black text-grey-900 uppercase tracking-widest">
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {metrics.map((m, i) => (
                        <div key={i}
                            className="card-premium p-8 flex flex-col justify-between h-48 border-white/80 hover:border-primary/20 animate-slide-up group"
                            style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className={`p-4 rounded-2xl ${m.bg} ${m.color} shadow-lg transform group-hover:scale-110 transition-transform`}>
                                    <m.icon size={28} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-4xl font-black text-grey-900 leading-none mb-2 tracking-tighter">{m.value}</h2>
                                <p className="text-xs font-black text-grey-400 uppercase tracking-[0.2em]">{m.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Live Orders Queue */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="flex justify-between items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <h3 className="text-h2 font-black tracking-tight">Live Order Queue</h3>
                            <button
                                onClick={fetchLiveOrders}
                                className="w-12 h-12 glass-card flex items-center justify-center text-grey-400 hover:text-primary transition-all magnetic-btn"
                            >
                                <Clock size={24} className={refreshLoading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-5">
                            {liveOrders.length > 0 ? liveOrders.map((order, index) => {
                                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                const isVerified = order.status === STATUS.VERIFIED;

                                return (
                                    <div key={order.id}
                                        className="card-premium p-8 flex flex-col gap-8 animate-slide-up group border-white/80"
                                        style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-18 h-18 rounded-[24px] flex items-center justify-center shadow-xl ${isVerified ? 'bg-success-bg text-success' : 'bg-primary/10 text-primary'}`}>
                                                    {isVerified ? <ShieldCheck size={36} strokeWidth={2.5} /> : <ShoppingBag size={36} strokeWidth={2.5} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-grey-900 text-2xl tracking-tighter mb-1">Order #{order.id.slice(-4)}</h4>
                                                    <p className="text-[10px] font-black text-grey-400 uppercase tracking-[0.2em]">{new Date(order.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] mb-3 shadow-sm
                                                    ${order.status === STATUS.AWAITING_VERIFICATION ? 'bg-warning-bg text-warning' :
                                                        order.status === STATUS.VERIFIED ? 'bg-success-bg text-success' : 'bg-grey-100/50 text-grey-500'}`}>
                                                    <span className={`w-2 h-2 rounded-full ${order.status === STATUS.AWAITING_VERIFICATION ? 'bg-warning animate-pulse' : order.status === STATUS.VERIFIED ? 'bg-success' : 'bg-grey-400'}`}></span>
                                                    {order.status.replace('_', ' ')}
                                                </div>
                                                <p className="text-3xl font-black text-grey-900 tracking-tighter">₹{order.total_amount.toFixed(0)}</p>
                                            </div>
                                        </div>

                                        {/* Items Summary */}
                                        <div className="bg-grey-100/30 rounded-[20px] p-6 flex flex-wrap gap-3 border border-grey-100/50">
                                            {items.map((item, idx) => (
                                                <span key={idx} className="text-[11px] font-black text-grey-700 bg-white shadow-sm border border-grey-100/50 px-4 py-2 rounded-xl">
                                                    {item.quantity} × <span className="text-grey-400 font-bold">{item.product_name}</span>
                                                </span>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-5">
                                            {order.status === STATUS.VERIFIED ? (
                                                <button
                                                    className="btn bg-grey-900 text-white flex-1 py-5 shadow-2xl rounded-2xl font-black flex items-center justify-center gap-3 magnetic-btn"
                                                    onClick={() => handleAction(order.id, STATUS.EXITED)}
                                                >
                                                    <Zap size={24} fill="currentColor" /> ALLOW EXIT
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-primary flex-[2] py-5 shadow-primary rounded-2xl font-black text-lg flex items-center justify-center gap-3 magnetic-btn"
                                                        onClick={() => handleAction(order.id, STATUS.VERIFIED)}
                                                    >
                                                        <ShieldCheck size={24} strokeWidth={2.5} /> VERIFY PAYMENT
                                                    </button>
                                                    <button
                                                        className="btn bg-white text-error border-2 border-error/5 flex-1 py-5 hover:bg-error/5 rounded-2xl font-black tracking-widest magnetic-btn"
                                                        onClick={() => handleAction(order.id, STATUS.CANCELLED)}
                                                    >
                                                        CANCEL
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="card-premium p-16 flex flex-col items-center justify-center text-center border-dashed border-grey-200 bg-transparent shadow-none opacity-40">
                                    <div className="bg-grey-100 p-8 rounded-[32px] mb-6">
                                        <Clock size={64} className="text-grey-300" strokeWidth={1} />
                                    </div>
                                    <h3 className="text-2xl font-black text-grey-900 tracking-tight">No Active Orders</h3>
                                    <p className="text-sm font-bold text-grey-400 uppercase tracking-widest">Awaiting customer activity</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Inventory Alert */}
                    <div className="flex flex-col gap-8">
                        <h3 className="text-h2 font-black tracking-tight animate-slide-up" style={{ animationDelay: '0.8s' }}>Intelligent Alerts</h3>
                        <div className="glass-card p-8 border-white animate-slide-up relative overflow-hidden"
                            style={{ animationDelay: '0.9s' }}>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-error/5 rounded-full blur-[60px] -mr-16 -mt-16"></div>

                            <div className="flex items-center gap-5 relative z-10 mb-8">
                                <div className="bg-error/10 p-4 rounded-2xl text-error shadow-sm">
                                    <AlertCircle size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h4 className="font-black text-grey-900 text-xl tracking-tight">Low Stock</h4>
                                    <p className="text-[10px] text-error font-black uppercase tracking-[0.2em]">Critical Attention</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 relative z-10">
                                {products.filter(p => p.stock < 10).slice(0, 5).map((p, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 glass-card border-white/50 shadow-sm hover:translate-x-1 transition-transform">
                                        <div>
                                            <p className="text-sm font-black text-grey-900 truncate max-w-[130px]">{p.product_name}</p>
                                            <p className="text-[10px] font-bold text-grey-400 tracking-widest uppercase">{p.product_code}</p>
                                        </div>
                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm ${p.stock < 5 ? 'bg-error text-white' : 'bg-warning text-grey-900'}`}>
                                            {p.stock} UNITS
                                        </span>
                                    </div>
                                ))}
                                {products.filter(p => p.stock < 10).length === 0 && (
                                    <div className="py-12 text-center opacity-30">
                                        <ShieldCheck size={48} className="mx-auto mb-4 text-grey-300" strokeWidth={1} />
                                        <p className="text-xs text-grey-500 font-black uppercase tracking-widest">Inventory Healthy</p>
                                    </div>
                                )}
                            </div>

                            <Link to="/admin/inventory" className="btn btn-secondary w-full mt-10 py-4 rounded-2xl flex items-center justify-center gap-3 font-black tracking-widest magnetic-btn shadow-xl">
                                MANAGE STOCK <ChevronRight size={20} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
