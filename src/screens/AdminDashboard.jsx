import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Users, ShoppingCart, TrendingUp, Clock, AlertCircle, Zap, ChevronRight, Loader2, QrCode, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

const Sidebar = () => (
    <div className="sidebar shadow-lg">
        <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-primary p-2 rounded-lg shadow-md">
                <Zap size={20} className="text-white" />
            </div>
            <h2 className="text-primary font-extrabold text-xl">SkipLine</h2>
        </div>

        <div className="flex flex-col gap-2">
            <p className="caption text-grey-400 font-bold mb-2 ml-2">MAIN MENU</p>
            <Link to="/admin" className="btn gap-3 justify-start bg-grey-100 text-primary shadow-sm">
                <LayoutDashboard size={20} /> <span className="font-bold">Dashboard</span>
            </Link>
            <Link to="/admin/inventory" className="btn gap-3 justify-start shadow-none text-grey-500 hover:bg-light hover:text-primary transition-all">
                <Package size={20} /> <span className="font-medium">Inventory</span>
            </Link>
            <Link to="/admin/analytics" className="btn gap-3 justify-start shadow-none text-grey-500 hover:bg-light hover:text-primary transition-all">
                <BarChart3 size={20} /> <span className="font-medium">Analytics</span>
            </Link>
            <Link to="/admin/qrcodes" className="btn gap-3 justify-start shadow-none text-grey-500 hover:bg-light hover:text-primary transition-all">
                <QrCode size={20} /> <span className="font-medium">QR Gallery</span>
            </Link>
        </div>

        <div className="mt-auto pt-6 border-t" style={{ borderStyle: 'dashed' }}>
            <Link to="/" className="btn btn-outline w-full gap-2 border-grey-100 mb-2">
                <Users size={18} /> Exit Admin
            </Link>
            <button
                onClick={() => {
                    sessionStorage.removeItem('skipline_isAdmin');
                    window.location.href = '/admin/login';
                }}
                className="btn btn-primary w-full gap-2"
            >
                Log Out
            </button>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { products, updateOrderStatus, STATUS, loading } = useStore();
    const [liveOrders, setLiveOrders] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, count: 0 });
    const [refreshLoading, setRefreshLoading] = useState(false);

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
        await fetchLiveOrders();
        setRefreshLoading(false);
    };

    if (loading) {
        return (
            <div className="admin-content mesh-bg flex items-center justify-center">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    const metrics = [
        { label: 'Live Orders', value: liveOrders.length.toString(), icon: Users, color: 'var(--color-secondary)', bg: 'var(--color-secondary-glow)' },
        { label: "Today's Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'var(--success)', bg: 'rgba(0, 186, 74, 0.1)' },
        { label: 'Total Verified', value: stats.count.toString(), icon: ShoppingCart, color: 'var(--color-primary)', bg: 'var(--color-primary-glow)' },
        { label: 'Low Stock', value: products.filter(p => p.stock < 10).length.toString(), icon: AlertCircle, color: 'var(--warning)', bg: 'rgba(255, 204, 0, 0.1)' },
    ];

    return (
        <div className="admin-content mesh-bg">
            <Sidebar />
            <div className="p-10 animate-fade">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="font-extrabold text-grey-900">Performance Overview</h1>
                        <p className="body-sm text-grey-500 font-medium">Monitoring real-time store activity and financial metrics.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn glass shadow-sm gap-2 py-3 px-5">
                            <Clock size={18} /> Historial Data
                        </button>
                        <button className="btn btn-primary gap-2 py-3 px-5 shadow-lg">
                            <TrendingUp size={18} /> Export Report
                        </button>
                    </div>
                </div>

                <div className="flex gap-6 mb-10">
                    {metrics.map((m, i) => (
                        <div key={i} className="card-premium flex-1 flex flex-col gap-6 hover:scale-105 transition-transform">
                            <div className="flex justify-between items-start">
                                <div className="p-4 rounded-2xl shadow-sm" style={{ background: m.bg, color: m.color }}>
                                    <m.icon size={28} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="tag tag-success glass px-2 py-1 text-[10px] font-bold">+12.5%</span>
                                    <p className="caption text-grey-400 mt-2">vs yesterday</p>
                                </div>
                            </div>
                            <div>
                                <p className="caption text-grey-500 font-extrabold">{m.label}</p>
                                <h1 className="text-3xl font-extrabold text-grey-900 mt-1">{m.value}</h1>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-8">
                    <div className="card-premium flex-[2] flex flex-col gap-8 min-h-[500px]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <h3 className="font-extrabold text-grey-900">Live Orders Queue</h3>
                                <span className="tag px-3 py-1 bg-primary text-white rounded-full text-[10px] font-bold animate-pulse">
                                    {liveOrders.filter(o => o.status !== STATUS.VERIFIED).length} NEW
                                </span>
                            </div>
                            <button className="btn glass p-2 rounded-lg text-primary" onClick={fetchLiveOrders}>
                                <Clock size={20} className={refreshLoading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {liveOrders.length > 0 ? liveOrders.map((order) => {
                                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                return (
                                    <div key={order.id} className="flex flex-col p-6 bg-grey-100 bg-opacity-50 rounded-2xl border border-white hover:bg-white hover:shadow-sm transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white p-3 rounded-xl shadow-sm border border-grey-100">
                                                    <Users size={24} className="text-secondary" />
                                                </div>
                                                <div>
                                                    <p className="body-sm font-extrabold text-grey-900">{order.customer_name || 'Guest Customer'}</p>
                                                    <p className="caption text-grey-500 font-medium">#{order.id.slice(-8).toUpperCase()} • {new Date(order.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`tag px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-1 ${order.status === STATUS.AWAITING_VERIFICATION ? 'bg-warning text-white' :
                                                    order.status === STATUS.VERIFIED ? 'bg-success text-white' : 'bg-grey-400 text-white'
                                                    }`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                                <p className="text-lg font-extrabold text-primary">₹{order.total_amount.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6 p-3 bg-white bg-opacity-40 rounded-xl border border-dashed border-grey-200">
                                            {items.map((item, idx) => (
                                                <span key={idx} className="caption font-bold text-grey-500 bg-grey-100 px-2 py-1 rounded-md">
                                                    {item.quantity}x {item.product_name}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-4">
                                            {order.status === STATUS.VERIFIED ? (
                                                <button
                                                    className="btn btn-secondary flex-1 py-3 text-white gap-2"
                                                    onClick={() => handleAction(order.id, STATUS.EXITED)}
                                                >
                                                    <Zap size={18} /> Allow Exit
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-primary flex-1 py-3 gap-2"
                                                        onClick={() => handleAction(order.id, STATUS.VERIFIED)}
                                                    >
                                                        <ShieldCheck size={18} /> Mark as Verified
                                                    </button>
                                                    <button
                                                        className="btn glass flex-1 py-3 text-error border-error border-opacity-20 gap-2"
                                                        style={{ background: 'rgba(255, 59, 48, 0.05)' }}
                                                        onClick={() => handleAction(order.id, STATUS.CANCELLED)}
                                                    >
                                                        <AlertCircle size={18} /> Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                    <ShoppingCart size={64} className="mb-4" />
                                    <p className="font-extrabold uppercase tracking-widest">No Active Orders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card-premium flex-1 flex flex-col gap-6 border-l-4 border-l-primary">
                        <div className="flex items-center gap-3">
                            <AlertCircle size={24} className="text-error" />
                            <h3 className="font-extrabold text-grey-900">Inventory Status</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            {products.filter(p => p.stock < 10).slice(0, 5).map((p, i) => (
                                <div key={i} className={`flex flex-col gap-2 p-4 ${p.stock < 5 ? 'bg-error-light' : 'bg-warning-light'} rounded-2xl border border-white`}>
                                    <div className="flex justify-between">
                                        <p className={`caption font-extrabold ${p.stock < 5 ? 'text-error' : 'text-warning'}`}>
                                            {p.stock < 5 ? 'CRITICAL' : 'LOW STOCK'}
                                        </p>
                                        <span className="caption font-bold text-grey-700">{p.stock} left</span>
                                    </div>
                                    <p className="body-sm font-bold text-grey-900">{p.product_name}</p>
                                </div>
                            ))}
                        </div>
                        <Link to="/admin/inventory" className="btn btn-primary w-full mt-auto shadow-md">Manage Inventory</Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
