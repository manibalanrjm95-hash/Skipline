import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import AdminSidebar from '../components/AdminSidebar';
import { Users, TrendingUp, ShieldCheck, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
    const { products, updateOrderStatus, STATUS, loading } = useStore();
    const [liveOrders, setLiveOrders] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, count: 0 });
    const [refreshLoading, setRefreshLoading] = useState(false);
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
        if (newStatus === STATUS.EXITED) addToast(`Order #${shortId} allowed exit`, 'info');

        await fetchLiveOrders();
        setRefreshLoading(false);
    };

    if (loading) {
        return (
            <div className="flex bg-md-sys-color-surface min-h-screen">
                <AdminSidebar />
                <div className="flex-1 p-10">
                    <Skeleton className="h-10 w-48 mb-10" />
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-[28px]" />)}
                    </div>
                </div>
            </div>
        );
    }

    const metrics = [
        { label: 'Live Orders', value: liveOrders.length.toString(), icon: Users, color: 'text-md-sys-color-primary', bg: 'bg-md-sys-color-primary-container' },
        { label: "Today's Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-md-sys-color-secondary', bg: 'bg-md-sys-color-secondary-container' },
        { label: 'Total Verified', value: stats.count.toString(), icon: ShieldCheck, color: 'text-md-sys-color-on-surface', bg: 'bg-md-sys-color-surface-variant' },
        { label: 'Low Stock', value: products.filter(p => p.stock < 10).length.toString(), icon: AlertCircle, color: 'text-md-sys-color-error', bg: 'bg-md-sys-color-error-container' },
    ];

    return (
        <div className="flex bg-md-sys-color-surface min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-10 overflow-y-auto">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="headline-large text-md-sys-color-on-surface">Admin Console</h1>
                        <p className="label-large text-md-sys-color-on-surface-variant uppercase tracking-widest mt-1 font-bold">Material 3 Dashboard</p>
                    </div>
                    <button
                        className="w-14 h-14 flex items-center justify-center m3-card card-elevated rounded-full state-layer"
                        onClick={() => { setRefreshLoading(true); fetchLiveOrders().then(() => setRefreshLoading(false)); }}
                    >
                        <RefreshCw size={24} className={refreshLoading ? 'animate-spin' : ''} />
                    </button>
                </header>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {metrics.map((m, i) => (
                        <div key={i} className="m3-card card-elevated h-44 flex flex-col justify-between p-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.bg} ${m.color}`}>
                                <m.icon size={28} />
                            </div>
                            <div>
                                <h2 className="display-small font-bold text-md-sys-color-on-surface mb-1">{m.value}</h2>
                                <p className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest">{m.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="headline-medium text-md-sys-color-on-surface">Live Order Queue</h2>
                        <div className="flex flex-col gap-4">
                            {liveOrders.length > 0 ? liveOrders.map((order) => {
                                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                return (
                                    <div key={order.id} className="m3-card card-outlined flex flex-col gap-6 p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container rounded-full flex items-center justify-center">
                                                    <Clock size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="title-large font-bold text-md-sys-color-on-surface">Order #{order.id.slice(-4)}</h3>
                                                    <p className="body-medium text-md-sys-color-on-surface-variant">{new Date(order.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="title-large font-bold text-md-sys-color-primary mb-1">₹{order.total_amount.toFixed(0)}</p>
                                                <span className="m3-chip btn-tonal border-none h-6 px-3">
                                                    <span className="text-[10px] font-bold uppercase">{order.status.replace('_', ' ')}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 py-4 border-t border-md-sys-color-outline-variant">
                                            {items.map((item, idx) => (
                                                <span key={idx} className="label-medium bg-md-sys-color-surface-variant text-md-sys-color-on-surface-variant px-3 py-1.5 rounded-full">
                                                    {item.quantity} × {item.product_name}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-4">
                                            {order.status === STATUS.VERIFIED ? (
                                                <button
                                                    className="m3-btn btn-filled flex-1 h-12"
                                                    onClick={() => handleAction(order.id, STATUS.EXITED)}
                                                >
                                                    ALLOW EXIT
                                                </button>
                                            ) : (
                                                <button
                                                    className="m3-btn btn-tonal flex-1 h-12"
                                                    onClick={() => handleAction(order.id, STATUS.VERIFIED)}
                                                >
                                                    VERIFY PAYMENT
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="m3-card card-filled py-32 text-center opacity-30">
                                    <p className="body-large">No active orders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="headline-medium text-md-sys-color-on-surface">Stock Alerts</h2>
                        <div className="m3-card card-elevated space-y-6">
                            {products.filter(p => p.stock < 10).length > 0 ? (
                                products.filter(p => p.stock < 10).slice(0, 5).map((p, i) => (
                                    <div key={i} className="flex justify-between items-center pb-4 border-b border-md-sys-color-outline-variant last:border-0 last:pb-0">
                                        <div className="min-w-0">
                                            <p className="title-medium font-bold text-md-sys-color-on-surface truncate">{p.product_name}</p>
                                            <p className="label-small text-md-sys-color-on-surface-variant uppercase">{p.product_code}</p>
                                        </div>
                                        <span className={`label-medium font-bold px-3 py-1 rounded-full ${p.stock < 5 ? 'bg-md-sys-color-error text-white' : 'bg-md-sys-color-error-container text-md-sys-color-on-error-container'}`}>
                                            {p.stock} Units
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="body-medium text-md-sys-color-on-surface-variant text-center py-10">All items in stock</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
