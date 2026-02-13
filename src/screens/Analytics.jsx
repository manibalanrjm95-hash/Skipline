import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, TrendingUp, TrendingDown, Clock, Users, Zap, Search, Calendar, ChevronRight, Loader2, QrCode, LogOut, ArrowUpRight, ArrowDownRight, Menu } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Skeleton from '../components/Skeleton';
import AdminSidebar from '../components/AdminSidebar';
import { useState } from 'react';



const Analytics = () => {
    const { products, orders, loading } = useStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex bg-grey-50 min-h-screen">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="ml-64 flex-1 p-10 animate-fade admin-content">
                    <div className="flex justify-between items-end mb-10">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-4 w-96" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-12 w-32 rounded-xl" />
                            <Skeleton className="h-12 w-40 rounded-xl" />
                        </div>
                    </div>

                    <div className="flex gap-8 mb-10">
                        <div className="flex-[2] bg-white p-8 rounded-[32px] shadow-sm border border-grey-100 flex flex-col gap-8 h-[400px]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Skeleton className="h-8 w-48 mb-2" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                            </div>
                            <div className="flex items-end justify-between gap-4 h-full pt-8 pb-2">
                                {[1, 2, 3, 4, 5, 6, 7].map(i => <Skeleton key={i} className="flex-1 rounded-t-xl" style={{ height: `${Math.random() * 80 + 20}%` }} />)}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-6">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-[24px]" />)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <Skeleton className="h-80 rounded-[32px]" />
                        <Skeleton className="h-80 rounded-[32px]" />
                    </div>
                </div>
            </div>
        );
    }

    const chartData = [1200, 1900, 1500, 2500, 2100, 3200, 4250];
    const maxVal = Math.max(...chartData);

    const analyticsStats = [
        { label: 'Conversion Rate', value: '68.5%', trend: '+4.2%', isPositive: true },
        { label: 'Avg Order Value', value: '₹342.50', trend: '-2.1%', isPositive: false },
        { label: 'Customer Satisfaction', value: '4.9/5', trend: '+0.1%', isPositive: true },
    ];

    return (
        <div className="flex bg-grey-50 min-h-screen">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="ml-64 flex-1 p-10 animate-fade admin-content">
                <div className="flex justify-between items-end mb-10 flex-col-mobile gap-4">
                    <div className="flex items-center gap-4 w-full">
                        <button
                            className="show-on-mobile p-2 bg-white rounded-xl shadow-sm border border-grey-100 text-grey-600"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-grey-900 tracking-tight">Advanced Analytics</h1>
                            <p className="text-grey-500 font-medium mt-1">Deep-dive insights into consumer behavior and regional performance.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-5 py-3 rounded-xl bg-white text-grey-500 font-bold border border-grey-100 shadow-sm hover:bg-grey-50 transition-colors flex items-center gap-2">
                            <Calendar size={18} /> Last 7 Days
                        </button>
                        <button className="px-5 py-3 rounded-xl bg-grey-900 text-white font-bold shadow-lg shadow-grey-900/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                            <Search size={18} /> Advanced Filter
                        </button>
                    </div>
                </div>

                <div className="flex gap-8 mb-10">
                    {/* Revenue Chart */}
                    <div className="flex-[2] bg-white p-8 rounded-[32px] shadow-sm border border-grey-100 flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-extrabold text-grey-900">Revenue Growth</h3>
                                <p className="text-sm font-medium text-grey-500">Gross revenue across all channels</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary/20 border-[3px] border-primary"></div>
                                    <span className="text-xs font-bold text-grey-600 uppercase tracking-wider">Current</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-grey-100 border-[3px] border-grey-300"></div>
                                    <span className="text-xs font-bold text-grey-400 uppercase tracking-wider">Target</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end justify-between gap-4 h-64 pt-8 border-b border-dashed border-grey-100 pb-2">
                            {chartData.map((val, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group cursor-pointer">
                                    <div className="relative w-full flex justify-center h-full items-end">
                                        <div
                                            className="w-full max-w-[40px] rounded-t-xl transition-all duration-500 ease-out group-hover:scale-y-105 origin-bottom relative overflow-hidden"
                                            style={{
                                                height: `${(val / maxVal) * 100}%`,
                                                background: i === 6 ? 'var(--color-primary)' : 'rgba(243, 244, 246, 1)',
                                            }}
                                        >
                                            {i === 6 && <div className="absolute inset-0 bg-white/20"></div>}
                                        </div>
                                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-grey-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl mb-2 z-10 whitespace-nowrap">
                                            ₹{val.toLocaleString()}
                                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-grey-900 rotate-45"></div>
                                        </div>
                                    </div>

                                    <span className={`text-xs font-bold uppercase tracking-wider ${i === 6 ? 'text-primary' : 'text-grey-400'}`}>
                                        Day {i + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Stats Side Cards */}
                    <div className="flex-1 flex flex-col gap-6">
                        {analyticsStats.map((s, i) => (
                            <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-grey-100 hover:shadow-md transition-all hover:border-primary/20 group">
                                <p className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-2">{s.label}</p>
                                <div className="flex justify-between items-end">
                                    <h1 className="text-3xl font-black text-grey-900">{s.value}</h1>
                                    <div className={`flex items-center gap-1 font-extrabold text-sm px-2 py-1 rounded-lg ${s.isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                        {s.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                        {s.trend}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Top Products */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-grey-100 flex flex-col gap-6">
                        <h3 className="text-xl font-extrabold text-grey-900">Highest Performing SKUs</h3>
                        <div className="flex flex-col gap-4">
                            {products.slice(0, 3).map((p, i) => (
                                <div key={i} className="flex items-center gap-5 p-4 bg-grey-50 rounded-[20px] border border-transparent hover:border-grey-200 transition-colors group">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-grey-900 text-lg border border-grey-100">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-grey-900 text-base">{p.product_name}</p>
                                        <p className="text-xs font-bold text-grey-400 uppercase tracking-wider mt-0.5">{p.product_code}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-extrabold text-grey-900 text-lg">124 <span className="text-xs text-grey-500 font-bold uppercase">units</span></p>
                                        <p className="text-xs font-bold text-success">+12% growth</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market Potential */}
                    <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="flex justify-between items-center relative z-10">
                            <h3 className="text-xl font-extrabold text-grey-900">Market Potential Index</h3>
                            <button className="p-2.5 rounded-xl bg-white shadow-sm text-primary hover:scale-110 transition-transform">
                                <Clock size={20} />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 relative z-10 my-4">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                {/* Background Circle */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        className="text-primary/10"
                                    />
                                    {/* Progress Circle */}
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        strokeDasharray="283"
                                        strokeDashoffset="45" // 84% simplified
                                        strokeLinecap="round"
                                        className="text-primary drop-shadow-lg"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-grey-900">84%</span>
                                    <span className="text-xs font-bold text-grey-500 uppercase tracking-widest mt-1">Score</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-black text-grey-900 mb-2">Optimized Performance</h4>
                                <p className="text-sm font-medium text-grey-500 max-w-[280px] leading-relaxed">
                                    AI-driven analysis indicates high growth potential in the beverage segment for next quarter.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
