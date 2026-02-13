import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Edit3, EyeOff, Package, X, Check, AlertCircle, ShoppingBag } from 'lucide-react';
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
            <div className="flex bg-md-sys-color-surface min-h-screen">
                <AdminSidebar />
                <div className="flex-1 p-10">
                    <Skeleton className="h-10 w-48 mb-10" />
                    <Skeleton className="h-14 w-full rounded-full mb-12" />
                    <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-[28px]" />)}
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
        <div className="flex bg-md-sys-color-surface min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-10 overflow-y-auto">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="headline-large text-md-sys-color-on-surface">Stock Control</h1>
                        <p className="label-large text-md-sys-color-on-surface-variant uppercase tracking-widest mt-1 font-bold">Inventory Management</p>
                    </div>
                    <div className="m3-chip btn-tonal border-none h-10 px-4">
                        <span className="label-large font-bold">{products.length} Items Indexed</span>
                    </div>
                </header>

                {/* M3 Search */}
                <div className="relative mb-12">
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        className="m3-text-field rounded-full px-14 border-none"
                        style={{ borderRadius: '28px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-md-sys-color-on-surface-variant opacity-60">
                        <Search size={22} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
                    {filteredProducts.map((p) => (
                        <div key={p.id} className="m3-card card-elevated flex flex-col gap-6 p-6 group state-layer">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-md-sys-color-surface-variant rounded-2xl flex items-center justify-center text-md-sys-color-on-surface-variant group-hover:bg-md-sys-color-primary-container group-hover:text-md-sys-color-on-primary-container transition-colors">
                                        <Package size={28} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="title-medium font-bold text-md-sys-color-on-surface truncate">{p.product_name}</p>
                                        <p className="label-small text-md-sys-color-on-surface-variant uppercase">{p.product_code}</p>
                                    </div>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.barcode_enabled ? 'text-md-sys-color-primary bg-md-sys-color-primary-container' : 'text-md-sys-color-outline bg-md-sys-color-surface-variant'}`}>
                                    {p.barcode_enabled ? <Check size={16} /> : <EyeOff size={16} />}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-md-sys-color-surface-variant/40 rounded-2xl border border-md-sys-color-outline-variant">
                                <div>
                                    <p className="label-small text-md-sys-color-on-surface-variant uppercase mb-0.5">Price</p>
                                    <p className="title-large font-bold text-md-sys-color-on-surface">₹{p.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="label-small text-md-sys-color-on-surface-variant uppercase mb-0.5">Stock</p>
                                    <span className={`title-medium font-bold ${p.stock < 10 ? 'text-md-sys-color-error' : 'text-md-sys-color-on-surface'}`}>
                                        {p.stock} Units
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    className="m3-btn btn-tonal flex-1 h-12"
                                    onClick={() => handleEdit(p)}
                                >
                                    <Edit3 size={18} className="mr-2" /> EDIT
                                </button>
                                <button
                                    className={`m3-btn flex-1 h-12 ${p.barcode_enabled ? 'bg-md-sys-color-error-container text-md-sys-color-on-error-container' : 'btn-filled'}`}
                                    onClick={() => toggleProductStatus(p.id)}
                                >
                                    {p.barcode_enabled ? 'DISABLE' : 'ENABLE'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* M3 Modal pattern */}
                {editingProduct && (
                    <div className="fixed inset-0 bg-md-sys-color-on-surface/40 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
                        <div className="m3-card card-elevated w-full max-w-sm p-8 shadow-2xl animate-slide-up bg-md-sys-color-surface">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="label-large font-bold text-md-sys-color-primary uppercase mb-1">Update Stock</p>
                                    <h2 className="headline-small text-md-sys-color-on-surface">{editingProduct.product_name}</h2>
                                </div>
                                <button onClick={() => setEditingProduct(null)} className="text-md-sys-color-on-surface-variant state-layer p-2 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest ml-1">Sale Price (₹)</label>
                                    <input
                                        type="number"
                                        className="m3-text-field font-bold"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest ml-1">Current Stock</label>
                                    <input
                                        type="number"
                                        className="m3-text-field font-bold"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-12">
                                <button className="m3-btn btn-tonal flex-1" onClick={() => setEditingProduct(null)}>CANCEL</button>
                                <button className="m3-btn btn-filled flex-1" onClick={handleSave}>SAVE</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
