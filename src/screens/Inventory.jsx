import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Edit3, Eye, EyeOff, Package, X, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';
import AdminSidebar from '../components/AdminSidebar';

const Inventory = () => {
    const { products, toggleProductStatus, updateProduct, loading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({ price: 0, stock: 0 });
    const { addToast } = useToast();

    if (loading) {
        return (
            <div className="flex bg-bg-app min-h-screen">
                <AdminSidebar />
                <div className="flex-1 p-10">
                    <Skeleton className="h-10 w-48 mb-10" />
                    <Skeleton className="h-14 w-full rounded-2xl mb-12" />
                    <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
                    </div>
                </div>
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
            addToast('Product updated successfully', 'success');
        } else {
            addToast('Failed to update product', 'error');
        }
    };

    const filteredProducts = products.filter(p =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.product_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-bg-app min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-10 overflow-y-auto">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="h1 text-text-primary">Stock Control</h1>
                        <p className="label-medium text-text-secondary uppercase tracking-widest mt-1">Inventory Management</p>
                    </div>
                    <div className="label font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                        {products.length} Items Indexed
                    </div>
                </header>

                {/* Search Bar */}
                <div className="relative mb-12">
                    <input
                        type="text"
                        placeholder="Search inventory by name, code or category..."
                        className="input-v2 pl-14"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary opacity-40">
                        <Search size={22} />
                    </div>
                </div>

                {/* Simplified Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
                    {filteredProducts.map((p) => (
                        <div key={p.id} className="card-v2 flex flex-col gap-6 group hover:border-secondary transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-bg-app border border-border rounded-xl flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                                        <Package size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="body font-bold text-text-primary truncate">{p.product_name}</p>
                                        <p className="label text-text-secondary uppercase">{p.product_code}</p>
                                    </div>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.barcode_enabled ? 'text-success bg-success/10' : 'text-border bg-bg-app'}`}>
                                    {p.barcode_enabled ? <Check size={16} /> : <EyeOff size={16} />}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-bg-app border border-border rounded-xl">
                                <div>
                                    <p className="label text-text-secondary uppercase mb-0.5">Price</p>
                                    <p className="h3 font-bold text-text-primary">₹{p.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="label text-text-secondary uppercase mb-0.5">Stock</p>
                                    <span className={`label font-bold ${p.stock < 10 ? 'text-error' : 'text-text-primary'}`}>
                                        {p.stock} Units
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    className="btn-v2 btn-v2-outline h-12 flex-1 text-sm"
                                    onClick={() => handleEdit(p)}
                                >
                                    <Edit3 size={16} className="mr-2" /> Edit
                                </button>
                                <button
                                    className={`btn-v2 h-12 flex-1 text-sm ${p.barcode_enabled ? 'bg-error/10 text-error border border-error/20' : 'btn-v2-primary'}`}
                                    onClick={() => toggleProductStatus(p.id)}
                                >
                                    {p.barcode_enabled ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edit Modal */}
                {editingProduct && (
                    <div className="fixed inset-0 bg-text-primary/10 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
                        <div className="card-v2 w-full max-w-sm p-8 shadow-2xl relative animate-slide-up border-2 border-border/80">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="label font-bold text-primary uppercase mb-1">Update Stock</p>
                                    <h2 className="h2 text-text-primary">{editingProduct.product_name}</h2>
                                </div>
                                <button onClick={() => setEditingProduct(null)} className="text-text-secondary">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="section-gap">
                                <div className="flex flex-col gap-2">
                                    <label className="label text-text-secondary uppercase tracking-widest ml-1">Sale Price (₹)</label>
                                    <input
                                        type="number"
                                        className="input-v2 font-bold"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="label text-text-secondary uppercase tracking-widest ml-1">Current Stock</label>
                                    <input
                                        type="number"
                                        className="input-v2 font-bold"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button className="btn-v2 btn-v2-outline flex-1" onClick={() => setEditingProduct(null)}>Cancel</button>
                                <button className="btn-v2 btn-v2-primary flex-1" onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
