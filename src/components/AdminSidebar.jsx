import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, QrCode, LogOut, Zap, X } from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/inventory', label: 'Inventory', icon: Package },
        { path: '/admin/qrcodes', label: 'QR Codes', icon: QrCode },
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* M3 Navigation Rail (Desktop) / Drawer (Mobile) */}
            <nav className={`fixed top-0 left-0 h-full z-50 bg-md-sys-color-surface border-r border-md-sys-color-outline-variant transition-transform duration-300 
                w-24 md:translate-x-0 ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-24'}`}>

                <div className="flex flex-col h-full py-8 items-center">
                    {/* Brand Icon */}
                    <div className="mb-10 flex items-center justify-center">
                        <div className="m3-card card-filled w-12 h-12 flex items-center justify-center rounded-2xl text-primary">
                            <Zap size={24} fill="currentColor" />
                        </div>
                    </div>

                    {/* Nav Items */}
                    <div className="flex flex-col gap-6 w-full px-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className="flex flex-col items-center group relative gap-1"
                            >
                                <div className={`w-14 h-8 flex items-center justify-center rounded-full transition-all duration-200 state-layer
                                    ${isActive(item.path) ? 'bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container' : 'text-grey-500 hover:text-grey-900'}`}>
                                    <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                                </div>
                                <span className={`label-medium text-[10px] font-bold uppercase tracking-widest text-center mt-1
                                    ${isActive(item.path) ? 'text-grey-900' : 'text-grey-400'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('skipline_isAdmin');
                            window.location.href = '/admin/login';
                        }}
                        className="mt-auto flex flex-col items-center gap-1 group w-full"
                    >
                        <div className="w-14 h-8 flex items-center justify-center rounded-full text-grey-500 hover:text-error hover:bg-error/5 transition-all state-layer">
                            <LogOut size={22} />
                        </div>
                        <span className="label-medium text-[10px] font-bold uppercase tracking-widest text-grey-400">Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default AdminSidebar;
