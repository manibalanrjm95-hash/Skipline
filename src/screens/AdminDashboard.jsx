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
            <div className="flex bg-bg-app min-h-screen">
                <AdminSidebar />
                <div className="flex-1 p-10">
                    <Skeleton className="h-10 w-48 mb-10" />
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    const metrics = [
        { label: 'Live Orders', value: liveOrders.length.toString(), icon: Users, color: 'text-primary' },
        { label: "Today's Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-secondary' },
        { label: 'Total Verified', value: stats.count.toString(), icon: ShieldCheck, color: 'text-success' },
        { label: 'Low Stock', value: products.filter(p => p.stock < 10).length.toString(), icon: AlertCircle, color: 'text-error' },
    ];

    return (
        <div className="flex bg-bg-app min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-10 overflow-y-auto">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="h1 text-text-primary">Admin Console</h1>
                        <p className="label-medium text-text-secondary uppercase tracking-widest mt-1">Status Overview</p>
                    </div>
                    <button
                        className="w-12 h-12 flex items-center justify-center card-v2 p-0 shadow-sm"
                        onClick={() => { setRefreshLoading(true); fetchLiveOrders().then(() => setRefreshLoading(false)); }}
                    >
                        <RefreshCw size={20} className={refreshLoading ? 'animate-spin' : ''} />
                    </button>
                </header>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {metrics.map((m, i) => (
                        <div key={i} className="card-v2 flex flex-col justify-between h-40">
                            <div className={`p-2.5 rounded-full w-fit ${m.color} bg-bg-app border border-border`}>
                                <m.icon size={24} />
                            </div>
                            <div>
                                <h2 className="h1 font-bold text-text-primary mb-1">{m.value}</h2>
                                <p className="label text-text-secondary uppercase tracking-widest">{m.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="h2 text-text-primary">Live Order Queue</h2>
                        <div className="flex flex-col gap-4">
                            {liveOrders.length > 0 ? liveOrders.map((order) => {
                                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                return (
                                    <div key={order.id} className="card-v2 flex flex-col gap-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-bg-app border border-border rounded-full flex items-center justify-center text-secondary">
                                                    <Clock size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="h3 font-bold text-text-primary">Order #{order.id.slice(-4)}</h3>
                                                    <p className="small text-text-secondary">{new Date(order.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="h3 font-bold text-text-primary mb-1">₹{order.total_amount.toFixed(2)}</p>
                                                <span className="label font-bold text-secondary uppercase bg-bg-app border border-border px-3 py-1 rounded-full">
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 py-4 border-t border-border">
                                            {items.map((item, idx) => (
                                                <span key={idx} className="small font-medium bg-bg-app px-3 py-1 rounded-full border border-border">
                                                    {item.quantity} × {item.product_name}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-4">
                                            {order.status === STATUS.VERIFIED ? (
                                                <button
                                                    className="btn-v2 btn-v2-primary"
                                                    onClick={() => handleAction(order.id, STATUS.EXITED)}
                                                >
                                                    Allow Exit
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn-v2 btn-v2-primary"
                                                    onClick={() => handleAction(order.id, STATUS.VERIFIED)}
                                                >
                                                    Verify Payment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="card-v2 py-20 text-center opacity-40">
                                    <p className="body text-text-secondary">No active orders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="h2 text-text-primary">Stock Alerts</h2>
                        <div className="card-v2 space-y-6">
                            {products.filter(p => p.stock < 10).length > 0 ? (
                                products.filter(p => p.stock < 10).slice(0, 5).map((p, i) => (
                                    <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                                        <div className="min-w-0">
                                            <p className="body font-bold text-text-primary truncate">{p.product_name}</p>
                                            <p className="small text-text-secondary uppercase">{p.product_code}</p>
                                        </div>
                                        <span className={`label font-bold px-3 py-1 rounded-full ${p.stock < 5 ? 'bg-error text-white' : 'bg-warning/10 text-warning'}`}>
                                            {p.stock} Units
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="small text-text-secondary text-center py-10">All items in stock</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
