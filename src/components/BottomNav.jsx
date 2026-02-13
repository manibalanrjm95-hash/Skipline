import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const BottomNav = () => {
    const { cartCount, orders } = useStore();
    const hasActiveOrders = orders && orders.length > 0;

    return (
        <nav className="m3-nav-bar group">
            <NavLink to="/dashboard" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
                <div className="icon-container">
                    <Home size={24} />
                </div>
                <span className="label-text">Home</span>
            </NavLink>

            <NavLink to="/cart" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
                <div className="icon-container relative">
                    <ShoppingCart size={24} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-md-sys-color-error text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-md-sys-color-surface">
                            {cartCount}
                        </span>
                    )}
                </div>
                <span className="label-text">Cart</span>
            </NavLink>

            <NavLink to="/orders" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
                <div className="icon-container relative">
                    <Clock size={24} />
                    {hasActiveOrders && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-md-sys-color-secondary rounded-full border border-md-sys-color-surface"></span>
                    )}
                </div>
                <span className="label-text">Orders</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
