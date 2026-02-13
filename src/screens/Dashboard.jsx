import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Package, CreditCard, ChevronRight, Zap, TrendingUp, Bell } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const Dashboard = () => {
    const { user, currentShop, cartCount, cartTotal } = useStore();
    const navigate = useNavigate();

    return (
        <div className="app-container mesh-bg flex flex-col">
            <div className="screen-padding flex-1 animate-fade">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg shadow-md">
                            <Zap size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="caption text-primary">Live Session</p>
                            <h2 className="text-grey-900 leading-tight">{currentShop?.shop_name || 'SkipLine Store'}</h2>
                        </div>
                    </div>
                    <button className="btn p-2 bg-white rounded-full shadow-sm relative border">
                        <Bell size={24} className="text-grey-700" />
                        <span className="absolute bg-error text-white rounded-full" style={{ top: '6px', right: '6px', width: '8px', height: '8px' }}></span>
                    </button>
                </div>

                {/* Main Stats Card */}
                <div className="card-premium glass mb-8 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="caption text-grey-500 font-bold mb-1">Current Balance</p>
                            <h1 className="text-grey-900">₹{cartTotal.toFixed(2)}</h1>
                        </div>
                        <div className="tag tag-success glass px-3 py-1 font-bold">
                            <TrendingUp size={14} className="mr-1 inline" /> ACTIVE
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-grey-100 rounded-lg flex flex-col gap-1">
                            <p className="caption text-grey-500">Items</p>
                            <p className="body-lg font-bold">{cartCount}</p>
                        </div>
                        <div className="flex-1 p-4 bg-blue-light rounded-lg flex flex-col gap-1">
                            <p className="caption text-secondary">Limit</p>
                            <p className="body-lg font-bold text-secondary">₹5,000</p>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary w-full gap-3 py-4"
                        onClick={() => navigate('/scan')}
                    >
                        <Zap size={20} /> Open Scanner
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-4">
                    <p className="caption text-grey-500 font-bold mb-2">QUICK ACTIONS</p>

                    <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <button
                            className="card glass flex flex-col items-center justify-center gap-3 py-6"
                            onClick={() => navigate('/cart')}
                        >
                            <div className="p-3 rounded-full bg-success text-white">
                                <ShoppingCart size={24} />
                            </div>
                            <span className="body-sm font-bold">My Cart</span>
                        </button>

                        <button className="card glass flex flex-col items-center justify-center gap-3 py-6">
                            <div className="p-3 rounded-full bg-secondary text-white">
                                <Package size={24} />
                            </div>
                            <span className="body-sm font-bold">Promotions</span>
                        </button>
                    </div>

                    <button className="card glass flex items-center justify-between p-5 mt-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-md bg-warning-light text-warning">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <p className="body-sm font-bold">Manage Payments</p>
                                <p className="caption text-grey-500 font-medium">Added card ends in 4921</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-grey-400" />
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default Dashboard;
