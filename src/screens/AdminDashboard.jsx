import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Users, ShoppingCart, TrendingUp, Clock, AlertCircle, Zap, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

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
        </div>

        <div className="mt-auto pt-6 border-t" style={{ borderStyle: 'dashed' }}>
            <Link to="/" className="btn btn-outline w-full gap-2 border-grey-100">
                <Users size={18} /> Exit Admin
            </Link>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { orders } = useStore();

    const metrics = [
        { label: 'Active Sessions', value: '12', icon: Users, color: 'var(--color-secondary)', bg: 'var(--color-secondary-glow)' },
        { label: "Today's Revenue", value: '₹4,250', icon: TrendingUp, color: 'var(--success)', bg: 'rgba(0, 186, 74, 0.1)' },
        { label: 'Total Orders', value: orders.length + 42, icon: ShoppingCart, color: 'var(--color-primary)', bg: 'var(--color-primary-glow)' },
        { label: 'Avg. Checkout', value: '45s', icon: Clock, color: 'var(--warning)', bg: 'rgba(255, 204, 0, 0.1)' },
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
                    <div className="card-premium flex-[2] flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <h3 className="font-extrabold text-grey-900">Live Shopping Sessions</h3>
                            <button className="btn glass p-2 rounded-lg text-primary">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between items-center p-5 bg-grey-100 bg-opacity-50 rounded-2xl border border-white hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-grey-100">
                                            <Users size={24} className="text-secondary" />
                                        </div>
                                        <div>
                                            <p className="body-sm font-extrabold text-grey-900">Terminal US-{i}482</p>
                                            <p className="caption text-grey-500 font-medium italic">Urapakkam Branch • {i * 2 + 1} items</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-success animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%' }}></div>
                                            <span className="caption font-extrabold text-success">SCANNING</span>
                                        </div>
                                        <p className="body-sm font-bold text-primary">₹{(i * 1240.5).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-premium flex-1 flex flex-col gap-6 border-l-4 border-l-primary">
                        <div className="flex items-center gap-3">
                            <AlertCircle size={24} className="text-error" />
                            <h3 className="font-extrabold text-grey-900">Stock Alerts</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 p-4 bg-error-light rounded-2xl border border-white">
                                <div className="flex justify-between">
                                    <p className="caption font-extrabold text-error">CRITICAL STOCK</p>
                                    <span className="caption font-bold text-grey-700">2 left</span>
                                </div>
                                <p className="body-sm font-bold text-grey-900">Fresh Whole Milk 1L</p>
                                <div className="progress-bar w-full mt-2" style={{ height: '6px' }}>
                                    <div className="progress-fill bg-error" style={{ width: '15%' }}></div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 p-4 bg-warning-light rounded-2xl border border-white">
                                <div className="flex justify-between">
                                    <p className="caption font-extrabold text-warning">LOW STOCK</p>
                                    <span className="caption font-bold text-grey-700">14 left</span>
                                </div>
                                <p className="body-sm font-bold text-grey-900">Multigrain Bread</p>
                                <div className="progress-bar w-full mt-2" style={{ height: '6px' }}>
                                    <div className="progress-fill bg-warning" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary w-full mt-auto shadow-md">Create Restock Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
