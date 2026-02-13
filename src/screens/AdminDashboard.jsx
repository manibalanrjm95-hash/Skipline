import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import AdminSidebar from '../components/AdminSidebar';
import { LayoutDashboard, Users, TrendingUp, ShieldCheck, AlertCircle, Clock, ShoppingBag, Zap, Check, X, RefreshCw } from 'lucide-react';

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
        const interval = setInterval(fetchLiveOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (orderId, newStatus) => {
        setRefreshLoading(true);
        await updateOrderStatus(orderId, newStatus);

        const shortId = orderId.slice(-4);
        if (newStatus === STATUS.VERIFIED) addToast(`Order #${shortId} verified`, 'success');
        if (newStatus === STATUS.CANCELLED) addToast(`Order #${shortId} cancelled`, 'error');
        if (newStatus === STATUS.EXITED) addToast(`Order #${shortId} cleared for exit`, 'success');

        await fetchLiveOrders();
        setRefreshLoading(false);
    };

    if (loading) {
        return (
            <div className="m3-scaffold flex-row">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="ml-24 flex-1 p-8">
                    <Skeleton className="h-10 w-48 mb-8" />
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    const metrics = [
        { label: 'Live Orders', value: liveOrders.length.toString(), icon: Users, color: 'text-primary' },
        { label: "Today's Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-md-sys-color-secondary' },
        { label: 'Total Verified', value: stats.count.toString(), icon: ShieldCheck, color: 'text-grey-700' },
        { label: 'Low Stock', value: products.filter(p => p.stock < 10).length.toString(), icon: AlertCircle, color: 'text-md-sys-color-error' },
    ];

    return (
        <div className="m3-scaffold flex-row">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="ml-24 flex-1 p-8">
                {/* M3 Admin Top App Bar */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="headline-medium text-grey-900">Dashboard</h1>
                        <p className="label-medium text-grey-500 uppercase tracking-widest mt-1">Command Center</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="m3-chip card-outlined h-10 px-4">
                            <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
                            <span className="label-medium font-bold text-grey-700">SYSTEM ONLINE</span>
                        </div>
                        <button
                            className="w-12 h-12 flex items-center justify-center m3-card card-elevated p-0 rounded-full state-layer"
                            onClick={() => { setRefreshLoading(true); fetchLiveOrders().then(() => setRefreshLoading(false)); }}
                        >
                            <RefreshCw size={20} className={refreshLoading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </header>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {metrics.map((m, i) => (
                        <div key={i} className="m3-card card-elevated h-40 flex flex-col justify-between shadow-sm border border-md-sys-color-outline-variant">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-md-sys-color-surface-variant ${m.color}`}>
                                <m.icon size={24} />
                            </div>
                            <div>
                                <h2 className="display-small text-grey-900 font-bold mb-1">{m.value}</h2>
                                <p className="label-medium text-grey-500 uppercase tracking-widest">{m.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Live Order Queue */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="title-large text-grey-900 px-1">Live Order Queue</h2>

                        <div className="space-y-4">
                            {liveOrders.length > 0 ? liveOrders.map((order) => {
                                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                const isVerified = order.status === STATUS.VERIFIED;
                                const isAwaiting = order.status === STATUS.AWAITING_VERIFICATION;

                                return (
                                    <div key={order.id} className="m3-card card-elevated border border-md-sys-color-outline-variant">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isVerified ? 'bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container' : 'bg-md-sys-color-primary-container text-md-sys-color-on-primary-container'}`}>
                                                    {isVerified ? <ShieldCheck size={28} /> : <ShoppingBag size={28} />}
                                                </div>
                                                <div>
                                                    <h3 className="title-medium text-grey-900">Order #{order.id.slice(-4)}</h3>
                                                    <p className="label-medium text-grey-500">{new Date(order.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`m3-chip h-7 px-3 border-none mb-2 ${isVerified ? 'btn-tonal' : isAwaiting ? 'bg-md-sys-color-error-container text-md-sys-color-on-error-container' : 'card-filled'}`}>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{order.status.replace('_', ' ')}</span>
                                                </div>
                                                <p className="title-large text-grey-900 font-bold">₹{order.total_amount.toFixed(0)}</p>
                                            </div>
                                        </div>

                                        {/* Items Chips */}
                                        <div className="flex flex-wrap gap-2 mb-8 bg-md-sys-color-surface-variant p-4 rounded-xl">
                                            {items.map((item, idx) => (
                                                <div key={idx} className="m3-chip bg-white border-md-sys-color-outline-variant h-8 px-3">
                                                    <span className="label-medium text-grey-700 font-bold">{item.quantity}×</span>
                                                    <span className="label-medium text-grey-500 ml-1">{item.product_name}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Bar */}
                                        <div className="flex gap-4">
                                            {isVerified ? (
                                                <button
                                                    className="m3-btn btn-filled flex-1 h-14 font-bold"
                                                    onClick={() => handleAction(order.id, STATUS.EXITED)}
                                                >
                                                    <Zap size={20} className="mr-2" /> ALLOW EXIT
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        className="m3-btn btn-filled flex-[2] h-14 font-bold"
                                                        onClick={() => handleAction(order.id, STATUS.VERIFIED)}
                                                    >
                                                        <ShieldCheck size={20} className="mr-2" /> VERIFY PAYMENT
                                                    </button>
                                                    <button
                                                        className="m3-btn btn-tonal flex-1 h-14 font-bold text-md-sys-color-error"
                                                        onClick={() => handleAction(order.id, STATUS.CANCELLED)}
                                                    >
                                                        <X size={20} className="mr-2" /> CANCEL
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                                    <Clock size={64} className="text-grey-300 mb-4" />
                                    <p className="body-large text-grey-500">No active orders right now</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column Alerts */}
                    <div className="space-y-6">
                        <h2 className="title-large text-grey-900 px-1">Alerts</h2>
                        <div className="m3-card card-filled border-md-sys-color-outline-variant">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-md-sys-color-error-container text-md-sys-color-on-error-container flex items-center justify-center">
                                    <AlertCircle size={20} />
                                </div>
                                <h3 className="title-medium text-grey-900">Critical Stock</h3>
                            </div>

                            <div className="space-y-3">
                                {products.filter(p => p.stock < 10).slice(0, 5).map((p, i) => (
                                    <div key={i} className="m3-card card-outlined h-14 flex items-center justify-between p-3">
                                        <p className="label-large text-grey-900 font-bold truncate flex-1">{p.product_name}</p>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold ${p.stock < 5 ? 'bg-md-sys-color-error text-white' : 'bg-md-sys-color-secondary-container text-grey-900'}`}>
                                            {p.stock} UNITS
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="m3-btn btn-tonal w-full h-12 mt-8 font-bold text-sm uppercase tracking-widest"
                                onClick={() => window.location.href = '/admin/inventory'}
                            >
                                Open Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
