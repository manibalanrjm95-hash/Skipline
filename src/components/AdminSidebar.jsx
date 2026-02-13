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
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/inventory', icon: Package, label: 'Inventory' },
        { path: '/admin/analytics', icon: BarChart3, label: 'Reports' },
        { path: '/admin/kiosk', icon: QrCode, label: 'Kiosk' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-md-sys-color-on-surface/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* M3 Navigation Rail / Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-80 bg-md-sys-color-surface border-r border-md-sys-color-outline-variant z-50 transform lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-10 px-4 mt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-md-sys-color-primary rounded-xl flex items-center justify-center text-white shadow-md">
                                <Zap size={24} fill="currentColor" />
                            </div>
                            <span className="headline-small font-bold text-md-sys-color-on-surface">SkipLine</span>
                        </div>
                        <button className="lg:hidden text-md-sys-color-on-surface-variant" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-4 h-14 px-6 rounded-[28px] transition-all group state-layer ${isActive(item.path)
                                        ? 'bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container font-bold shadow-sm'
                                        : 'text-md-sys-color-on-surface-variant hover:bg-md-sys-color-surface-variant/50'
                                    }`}
                            >
                                <div className={`w-8 h-8 flex items-center justify-center transition-transform group-active:scale-90 ${isActive(item.path) ? 'text-md-sys-color-on-secondary-container' : 'text-md-sys-color-outline'}`}>
                                    <item.icon size={24} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                                </div>
                                <span className="title-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto border-t border-md-sys-color-outline-variant pt-6 px-4">
                        <Link
                            to="/admin/login"
                            className="flex items-center gap-4 h-14 px-4 rounded-[28px] text-md-sys-color-error hover:bg-md-sys-color-error/5 transition-all group state-layer"
                        >
                            <div className="w-8 h-8 flex items-center justify-center">
                                <LogOut size={24} />
                            </div>
                            <span className="title-medium font-bold">Logout</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
