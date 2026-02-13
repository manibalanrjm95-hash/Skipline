import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Search, Plus, Edit3, Trash2, Eye, EyeOff, Zap, Filter, MoreVertical, Loader2, QrCode, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

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

const Inventory = () => {
    const { products, toggleProductStatus, updateProduct, loading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({ price: 0, stock: 0 });

    if (loading) {
        return (
            <div className="admin-content mesh-bg flex items-center justify-center">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    const handleEdit = (product) => {
        setEditingProduct(product);
        setEditForm({ price: product.price, stock: product.stock });
    };

    const handleSave = async () => {
        if (!editingProduct) return;
        const result = await updateProduct(editingProduct.id, {
            price: Number(editForm.price),
            stock: Number(editForm.stock)
        });
        if (result.success) {
            setEditingProduct(null);
        } else {
            alert('Failed to update product: ' + result.error);
        }
    };

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
                    </div>
                </div>

                <div className="overflow-hidden">
                    <table className="table-container w-full">
                        <thead className="table-head">
                            <tr style={{ background: 'transparent' }}>
                                <th className="px-6 py-4">PRODUCT DETAILS</th>
                                <th className="px-6 py-4">PRICING</th>
                                <th className="px-6 py-4">STOCK STATUS</th>
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
                                                <span className={`caption font-extrabold ${p.stock < 10 ? 'text-error' : 'text-success'}`}>
                                                    {p.stock} Units left
                                                </span>
                                            </div>
                                            <div className="progress-bar w-full bg-grey-100 rounded-full" style={{ height: '8px' }}>
                                                <div
                                                    className={`progress-fill rounded-full ${p.stock < 10 ? 'bg-error' : 'bg-success'}`}
                                                    style={{ width: `${Math.min(100, p.stock)}%` }}
                                                ></div>
                                            </div>
                                        </div>
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
                                            <button
                                                className="btn p-3 bg-grey-100 text-grey-500 rounded-xl hover:bg-primary hover:text-white transition-all"
                                                onClick={() => handleEdit(p)}
                                            >
                                                <Edit3 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editingProduct && (
                    <div className="fixed inset-0 bg-grey-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade">
                        <div className="card-premium bg-white w-full max-w-md flex flex-col gap-6 shadow-2xl p-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-extrabold text-grey-900">Edit Product</h2>
                                    <p className="body-sm text-grey-500 font-medium">{editingProduct.product_name}</p>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-2 rounded-xl text-primary">
                                    <Package size={24} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="caption font-extrabold text-grey-500">UNIT PRICE (₹)</label>
                                    <input
                                        type="number"
                                        className="input-field py-3 px-4 border rounded-xl font-bold text-grey-900 outline-none focus:border-primary"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="caption font-extrabold text-grey-500">STOCK QUANTITY</label>
                                    <input
                                        type="number"
                                        className="input-field py-3 px-4 border rounded-xl font-bold text-grey-900 outline-none focus:border-primary"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button className="btn glass flex-1 py-4 text-grey-500 font-bold" onClick={() => setEditingProduct(null)}>Cancel</button>
                                <button className="btn btn-primary flex-1 py-4 text-lg" onClick={handleSave}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
