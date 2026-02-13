import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const BottomNav = () => {
    const { cartCount, orders } = useStore();
    // Simple check if there are any active orders to show a dot
    const hasActiveOrders = orders && orders.length > 0;

    return (
        <nav className="bottom-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={24} strokeWidth={2.5} />
                <span className="caption">Home</span>
            </NavLink>

            <NavLink to="/cart" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} relative`}>
                <ShoppingCart size={24} strokeWidth={2.5} />
                <span className="caption">Cart</span>
                {cartCount > 0 && (
                    <span className="absolute bg-primary text-white font-bold rounded-full flex items-center justify-center shadow-sm"
                        style={{ top: '-6px', right: '10px', width: '20px', height: '20px', fontSize: '10px', border: '2px solid white' }}>
                        {cartCount}
                    </span>
                )}
            </NavLink>

            <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} relative`}>
                <FileText size={24} strokeWidth={2.5} />
                <span className="caption">Orders</span>
                {hasActiveOrders && (
                    <span className="absolute bg-secondary text-white rounded-full border-2 border-white"
                        style={{ top: '-2px', right: '12px', width: '10px', height: '10px' }}>
                    </span>
                )}
            </NavLink>
        </nav>
    );
};

export default BottomNav;
