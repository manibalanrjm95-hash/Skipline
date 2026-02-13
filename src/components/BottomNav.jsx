import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ScanLine, ShoppingCart, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const BottomNav = () => {
    const { cartCount } = useStore();

    return (
        <nav className="bottom-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={24} />
                <span className="caption">Home</span>
            </NavLink>
            <NavLink to="/scan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <ScanLine size={24} />
                <span className="caption">Scan</span>
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} relative`}>
                <ShoppingCart size={24} />
                <span className="caption">Cart</span>
                {cartCount > 0 && (
                    <span className="absolute bg-primary text-white font-bold rounded-full flex items-center justify-center" style={{ top: '-4px', right: '12px', width: '18px', height: '18px', fontSize: '10px' }}>
                        {cartCount}
                    </span>
                )}
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item`}>
                <User size={24} />
                <span className="caption">Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
