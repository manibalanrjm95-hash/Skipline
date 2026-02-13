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
        <div className="admin-layout flex bg-grey-50 min-h-screen">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="ml-64 flex-1 p-10 animate-fade-in transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-end mb-10 flex-col-mobile gap-4">
                    <div className="flex items-center gap-4 w-full">
                        <button
                            className="lg:hidden p-3 bg-white rounded-xl shadow-sm text-grey-600"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <p className="caption text-grey-400 mb-1">DASHBOARD</p>
                            <h1 className="text-display text-grey-900 leading-tight">Overview</h1>
                        </div>

                        <div className="ml-auto flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-grey-100">
                                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                                <span className="text-xs font-bold text-grey-600">System Online</span>
                            </div>
                            <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-grey-100 text-xs font-bold text-grey-900">
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {metrics.map((m, i) => (
                        <div key={i} className="card-premium p-6 flex flex-col justify-between h-40 border-transparent hover:border-grey-200">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl ${m.bg} ${m.color}`}>
                                    <m.icon size={24} strokeWidth={2.5} />
                                </div>
                                {/* <MoreHorizontal size={20} className="text-grey-300" /> */}
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-grey-900 leading-none mb-1">{m.value}</h2>
                                <p className="text-xs font-bold text-grey-400 uppercase tracking-wider">{m.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Live Orders Queue */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-h2 text-grey-900">Live Orders</h3>
                            <button
                                onClick={fetchLiveOrders}
                                className="p-2 bg-white rounded-full shadow-sm text-grey-400 hover:text-primary transition-colors hover:rotate-180 duration-500"
                            >
                                <Clock size={20} className={refreshLoading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {liveOrders.length > 0 ? liveOrders.map((order) => {
                                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                const isVerified = order.status === STATUS.VERIFIED;

                                return (
                                    <div key={order.id} className="card-premium p-6 flex flex-col gap-6 hover:shadow-lg transition-shadow border-transparent">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isVerified ? 'bg-success-bg text-success' : 'bg-primary/10 text-primary'}`}>
                                                    {isVerified ? <ShieldCheck size={28} /> : <ShoppingBag size={28} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-grey-900 text-lg">Order #{order.id.slice(-4)}</h4>
                                                    <p className="text-xs font-bold text-grey-400 uppercase">{new Date(order.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-1 
                                                    ${order.status === STATUS.AWAITING_VERIFICATION ? 'bg-warning-bg text-warning' :
                                                        order.status === STATUS.VERIFIED ? 'bg-success-bg text-success' : 'bg-grey-100 text-grey-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === STATUS.AWAITING_VERIFICATION ? 'bg-warning animate-pulse' : order.status === STATUS.VERIFIED ? 'bg-success' : 'bg-grey-400'}`}></span>
                                                    {order.status.replace('_', ' ')}
                                                </div>
                                                <p className="text-2xl font-black text-grey-900">₹{order.total_amount.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Items Summary */}
                                        <div className="bg-grey-50 rounded-xl p-4 flex flex-wrap gap-2">
                                            {items.map((item, idx) => (
                                                <span key={idx} className="text-xs font-bold text-grey-600 bg-white border border-grey-200 px-3 py-1.5 rounded-lg shadow-sm">
                                                    {item.quantity} × {item.product_name}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4">
                                            {order.status === STATUS.VERIFIED ? (
                                                <button
                                                    className="btn bg-grey-900 text-white flex-1 py-4 hover:bg-black shadow-lg rounded-xl font-bold flex items-center justify-center gap-2"
                                                    onClick={() => handleAction(order.id, STATUS.EXITED)}
                                                >
                                                    <Zap size={20} fill="currentColor" /> Allow Exit
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-primary flex-[2] py-4 shadow-primary rounded-xl font-bold flex items-center justify-center gap-2"
                                                        onClick={() => handleAction(order.id, STATUS.VERIFIED)}
                                                    >
                                                        <ShieldCheck size={20} /> Verify Payment
                                                    </button>
                                                    <button
                                                        className="btn bg-white text-error border-2 border-error/10 flex-1 py-4 hover:bg-error/5 rounded-xl font-bold"
                                                        onClick={() => handleAction(order.id, STATUS.CANCELLED)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="card-premium p-12 flex flex-col items-center justify-center text-center opacity-50 border-dashed border-grey-300 bg-transparent shadow-none">
                                    <div className="bg-grey-100 p-6 rounded-full mb-4">
                                        <Clock size={48} className="text-grey-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-grey-900">No Active Orders</h3>
                                    <p className="text-sm font-medium text-grey-500">New orders will appear here automatically.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Inventory Alert */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-h2 text-grey-900">Alerts</h3>
                        <div className="card-premium p-6 bg-white border-transparent relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-error/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                            <div className="flex items-center gap-3 relative z-10 mb-6">
                                <div className="bg-error/10 p-3 rounded-xl text-error">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-grey-900 text-lg">Low Stock</h4>
                                    <p className="text-xs text-grey-500 font-bold">Action Required</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 relative z-10">
                                {products.filter(p => p.stock < 10).slice(0, 5).map((p, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-grey-50 rounded-xl border border-grey-100/50">
                                        <div>
                                            <p className="text-sm font-bold text-grey-900 truncate max-w-[120px]">{p.product_name}</p>
                                            <p className="text-[10px] font-bold text-grey-400">{p.product_code}</p>
                                        </div>
                                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${p.stock < 5 ? 'bg-error text-white' : 'bg-warning-bg text-warning'}`}>
                                            {p.stock} left
                                        </span>
                                    </div>
                                ))}
                                {products.filter(p => p.stock < 10).length === 0 && (
                                    <div className="py-8 text-center">
                                        <p className="text-sm text-grey-400 font-medium">All stock levels are healthy.</p>
                                    </div>
                                )}
                            </div>

                            <Link to="/admin/inventory" className="btn btn-secondary w-full mt-8 py-3 rounded-xl flex items-center justify-center gap-2">
                                Manage Inventory <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
