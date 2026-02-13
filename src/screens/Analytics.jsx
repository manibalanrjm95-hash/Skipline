import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, TrendingUp, TrendingDown, Clock, Users, Zap, Search, Calendar, ChevronRight, Loader2, QrCode } from 'lucide-react';
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
            <Link to="/admin" className="btn gap-3 justify-start shadow-none text-grey-500 hover:bg-light hover:text-primary transition-all">
                <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
            </Link>
            <Link to="/admin/inventory" className="btn gap-3 justify-start shadow-none text-grey-500 hover:bg-light hover:text-primary transition-all">
                <Package size={20} /> <span className="font-medium">Inventory</span>
            </Link>
            <Link to="/admin/analytics" className="btn gap-3 justify-start bg-grey-100 text-primary shadow-sm">
                <BarChart3 size={20} /> <span className="font-bold">Analytics</span>
            </Link>
            <Link to="/admin/qrcodes" className="btn gap-3 justify-start shadow-none text-grey-500 hover:bg-light hover:text-primary transition-all">
                <QrCode size={20} /> <span className="font-medium">QR Gallery</span>
            </Link>
        </div>

        <div className="mt-auto pt-6 border-t" style={{ borderStyle: 'dashed' }}>
            <Link to="/" className="btn btn-outline w-full gap-2 border-grey-100">
                Exit Admin
            </Link>
        </div>
    </div>
);

const Analytics = () => {
    const { products, orders, loading } = useStore();

    if (loading) {
        return (
            <div className="admin-content mesh-bg flex items-center justify-center">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    const chartData = [1200, 1900, 1500, 2500, 2100, 3200, 4250];
    const maxVal = Math.max(...chartData);

    const analyticsStats = [
        { label: 'Conversion Rate', value: '68.5%', trend: '+4.2%', color: 'var(--success)' },
        { label: 'Avg Order Value', value: '₹342.50', trend: '-2.1%', color: 'var(--error)' },
        { label: 'Customer Satisfaction', value: '4.9/5', trend: '+0.1%', color: 'var(--success)' },
    ];

    return (
        <div className="admin-content mesh-bg">
            <Sidebar />
            <div className="p-10 animate-fade">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="font-extrabold text-grey-900">Advanced Analytics</h1>
                        <p className="body-sm text-grey-500 font-medium">Deep-dive insights into consumer behavior and regional performance.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn glass gap-2 border-white shadow-sm px-6">
                            <Calendar size={18} /> Last 7 Days
                        </button>
                        <button className="btn btn-primary gap-2 py-4 px-8 shadow-lg">
                            <Search size={18} /> Advanced Filter
                        </button>
                    </div>
                </div>

                <div className="flex gap-8 mb-10">
                    <div className="card-premium flex-[2] flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-extrabold text-grey-900">Revenue Growth Portfolio</h3>
                                <p className="caption text-grey-500 mt-1">Daily gross revenue across all checkouts</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--color-primary)' }}></div>
                                    <span className="caption font-bold">Current</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--grey-100)' }}></div>
                                    <span className="caption font-bold">Target</span>
                                </div>
                            </div>
                        </div>

                        <div className="chart-bar-container">
                            {chartData.map((val, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 flex-1">
                                    <div
                                        className="chart-bar glass relative flex items-center justify-center group"
                                        style={{
                                            height: `${(val / maxVal) * 160}px`,
                                            background: i === 6 ? 'var(--color-primary)' : 'var(--color-secondary-glow)',
                                            width: '80%',
                                            maxWidth: '50px'
                                        }}
                                    >
                                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-grey-900 text-white p-2 rounded-lg text-[10px] font-bold" style={{ bottom: '110%' }}>
                                            ₹{val}
                                        </div>
                                    </div>
                                    <span className="caption font-extrabold text-grey-400">Day {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        {analyticsStats.map((s, i) => (
                            <div key={i} className="card-premium flex flex-col gap-2 hover:translate-x-2 transition-transform">
                                <p className="caption text-grey-500 font-extrabold uppercase">{s.label}</p>
                                <div className="flex justify-between items-end">
                                    <h1 className="text-grey-900 text-3xl font-extrabold">{s.value}</h1>
                                    <div className="flex items-center gap-1 font-extrabold text-sm" style={{ color: s.color }}>
                                        {s.trend.startsWith('+') ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        {s.trend}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div className="card-premium flex flex-col gap-8">
                        <h3 className="font-extrabold text-grey-900">Highest Performing Skus</h3>
                        <div className="flex flex-col gap-4">
                            {products.slice(0, 3).map((p, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 glass rounded-2xl border border-white">
                                    <div className="bg-primary text-white p-3 rounded-xl font-extrabold">0{i + 1}</div>
                                    <div className="flex-1">
                                        <p className="body-sm font-extrabold text-grey-900">{p.product_name}</p>
                                        <p className="caption text-grey-500 font-medium">SKU: {p.product_code}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="body-sm font-extrabold text-primary">124 units</p>
                                        <p className="caption text-success font-bold">+12% growth</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-premium flex flex-col gap-8 bg-primary bg-opacity-5">
                        <div className="flex justify-between items-center">
                            <h3 className="font-extrabold text-grey-900">Market Potential Index</h3>
                            <button className="btn p-2 rounded-lg bg-white shadow-sm border border-grey-100">
                                <Clock size={20} className="text-primary" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center text-center gap-6">
                            <div className="relative">
                                <div className="p-12 rounded-full border-[10px] border-grey-100 flex items-center justify-center">
                                    <h1 className="text-primary text-4xl">84%</h1>
                                </div>
                                <svg className="absolute top-0 left-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="50%" cy="50%" r="46%" fill="none" stroke="var(--color-primary)" strokeWidth="10" strokeDasharray="290" strokeDashoffset="46" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="body-lg font-extrabold text-grey-900">Optimized Performance</p>
                                <p className="body-sm text-grey-500 max-w-xs">AI-driven analysis indicates high growth potential in the beverage segment for next quarter.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
