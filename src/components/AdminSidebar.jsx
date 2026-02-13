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

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`w-64 bg-white border-r border-grey-100 flex flex-col fixed h-full z-50 shadow-xl transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2.5 rounded-xl shadow-primary">
                                <Zap size={24} className="text-white fill-current" />
                            </div>
                            <div>
                                <h2 className="text-grey-900 font-extrabold text-2xl leading-none tracking-tight">SkipLine</h2>
                                <p className="text-xs text-grey-400 font-bold tracking-widest uppercase mt-1">Admin Portal</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="md:hidden text-grey-400 hover:text-grey-900">
                            <X size={24} />
                        </button>
                    </div>

                    <p className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-4 pl-2">Overview</p>
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/admin"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/admin') ? 'bg-primary/5 text-primary' : 'text-grey-500 hover:bg-grey-50 hover:text-grey-900'}`}
                            onClick={onClose}
                        >
                            <LayoutDashboard size={20} className={isActive('/admin') ? '' : 'group-hover:scale-110 transition-transform'} strokeWidth={isActive('/admin') ? 2.5 : 2} />
                            <span className={isActive('/admin') ? 'font-extrabold text-sm' : 'font-bold text-sm'}>Dashboard</span>
                        </Link>
                        <Link
                            to="/admin/inventory"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/admin/inventory') ? 'bg-primary/5 text-primary' : 'text-grey-500 hover:bg-grey-50 hover:text-grey-900'}`}
                            onClick={onClose}
                        >
                            <Package size={20} className={isActive('/admin/inventory') ? '' : 'group-hover:scale-110 transition-transform'} strokeWidth={isActive('/admin/inventory') ? 2.5 : 2} />
                            <span className={isActive('/admin/inventory') ? 'font-extrabold text-sm' : 'font-bold text-sm'}>Inventory</span>
                        </Link>
                        <Link
                            to="/admin/qrcodes"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/admin/qrcodes') ? 'bg-primary/5 text-primary' : 'text-grey-500 hover:bg-grey-50 hover:text-grey-900'}`}
                            onClick={onClose}
                        >
                            <QrCode size={20} className={isActive('/admin/qrcodes') ? '' : 'group-hover:scale-110 transition-transform'} strokeWidth={isActive('/admin/qrcodes') ? 2.5 : 2} />
                            <span className={isActive('/admin/qrcodes') ? 'font-extrabold text-sm' : 'font-bold text-sm'}>QR Codes</span>
                        </Link>
                        <Link
                            to="/admin/analytics"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/admin/analytics') ? 'bg-primary/5 text-primary' : 'text-grey-500 hover:bg-grey-50 hover:text-grey-900'}`}
                            onClick={onClose}
                        >
                            <BarChart3 size={20} className={isActive('/admin/analytics') ? '' : 'group-hover:scale-110 transition-transform'} strokeWidth={isActive('/admin/analytics') ? 2.5 : 2} />
                            <span className={isActive('/admin/analytics') ? 'font-extrabold text-sm' : 'font-bold text-sm'}>Analytics</span>
                        </Link>
                    </div>
                </div>

                <div className="mt-auto p-6 border-t border-grey-100 bg-grey-50/50">
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('skipline_isAdmin');
                            window.location.href = '/admin/login';
                        }}
                        className="flex items-center gap-3 text-grey-500 hover:text-error transition-colors w-full px-2 py-2"
                    >
                        <LogOut size={20} />
                        <span className="font-bold text-sm">Log Out</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
