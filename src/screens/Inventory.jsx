import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Search, Plus, Edit3, Trash2, Eye, EyeOff, Zap, Filter, MoreVertical } from 'lucide-react';
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
            <Link to="/admin/inventory" className="btn gap-3 justify-start bg-grey-100 text-primary shadow-sm">
                <Package size={20} /> <span className="font-bold">Inventory</span>
            </Link>
            <Link to="/admin/analytics" className="btn gap-3 justify-start shadow-none text-grey-500 hover:bg-light hover:text-primary transition-all">
                <BarChart3 size={20} /> <span className="font-medium">Analytics</span>
            </Link>
        </div>

        <div className="mt-auto pt-6 border-t" style={{ borderStyle: 'dashed' }}>
            <Link to="/" className="btn btn-outline w-full gap-2 border-grey-100">
                Exit Admin
            </Link>
        </div>
    </div>
);

const Inventory = () => {
    const { products, toggleProductStatus } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(p =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.product_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-content mesh-bg">
            <Sidebar />
            <div className="p-10 animate-fade">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="font-extrabold text-grey-900">Inventory Control</h1>
                        <p className="body-sm text-grey-500 font-medium">Manage product visibility, stock levels and digital identifiers.</p>
                    </div>
                    <button className="btn btn-primary gap-2 py-4 px-8 shadow-lg">
                        <Plus size={20} /> New Product
                    </button>
                </div>

                <div className="card-premium glass mb-10">
                    <div className="flex gap-6 items-center">
                        <div className="flex-1 bg-grey-100 rounded-2xl flex items-center px-6 border border-white focus-within:border-primary transition-all">
                            <Search size={22} className="text-grey-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Search inventory by name, code or SKU..."
                                className="border-none bg-transparent py-5 w-full text-grey-900 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="btn glass gap-2 border-white shadow-sm px-6">
                                <Filter size={18} /> Category
                            </button>
                            <button className="btn glass gap-2 border-white shadow-sm px-6">
                                <MoreVertical size={18} /> Batch Actions
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <table className="table-container w-full">
                        <thead className="table-head">
                            <tr style={{ background: 'transparent' }}>
                                <th className="px-6 py-4">PRODUCT DETAILS</th>
                                <th className="px-6 py-4">PRICING</th>
                                <th className="px-6 py-4">STOCK STATUS</th>
                                <th className="px-6 py-4">AVAILABILITY</th>
                                <th className="px-6 py-4 text-center">CONTROLS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.id} className="table-row group">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-5">
                                            <div className="bg-light p-2 rounded-xl border-2 border-grey-100 shadow-sm transition-transform group-hover:scale-110">
                                                <Package size={24} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="body-lg font-extrabold text-grey-900 text-md">{p.product_name}</p>
                                                <p className="caption text-grey-500 font-bold tracking-widest">{p.product_code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <p className="body-lg font-extrabold text-grey-900">₹{p.price}</p>
                                        <p className="caption text-grey-400">Fixed MRP</p>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex flex-col gap-2" style={{ width: '160px' }}>
                                            <div className="flex justify-between items-center px-1">
                                                <span className={`caption font-extrabold ${p.stock < 20 ? 'text-error' : 'text-success'}`}>
                                                    {p.stock} Units left
                                                </span>
                                            </div>
                                            <div className="progress-bar w-full bg-grey-100 rounded-full" style={{ height: '8px' }}>
                                                <div
                                                    className={`progress-fill rounded-full ${p.stock < 20 ? 'bg-error' : 'bg-success'}`}
                                                    style={{ width: `${Math.min(100, p.stock)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <span className={`tag px-4 py-2 font-extrabold border-2 ${p.barcode_enabled ? 'tag-success border-[#00BA4A22]' : 'tag-error border-[#FF3B3022] shadow-none'}`}>
                                            {p.barcode_enabled ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                className={`btn p-3 rounded-xl transition-all ${p.barcode_enabled ? 'bg-grey-100 text-grey-500 hover:bg-error hover:text-white' : 'bg-success text-white'}`}
                                                onClick={() => toggleProductStatus(p.id)}
                                                title={p.barcode_enabled ? 'Disable Scanning' : 'Enable Scanning'}
                                            >
                                                {p.barcode_enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                            <button className="btn p-3 bg-grey-100 text-grey-500 rounded-xl hover:bg-primary hover:text-white">
                                                <Edit3 size={20} />
                                            </button>
                                            <button className="btn p-3 bg-grey-100 text-error rounded-xl hover:bg-error hover:text-white">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
