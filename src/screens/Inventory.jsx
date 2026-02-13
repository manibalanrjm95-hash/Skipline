import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Edit3, Eye, EyeOff, Package, X, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';
import AdminSidebar from '../components/AdminSidebar';

const Inventory = () => {
    const { products, toggleProductStatus, updateProduct, loading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({ price: 0, stock: 0 });
    const { addToast } = useToast();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="m3-scaffold flex-row">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="ml-24 flex-1 p-8">
                    <Skeleton className="h-10 w-48 mb-8" />
                    <Skeleton className="h-14 w-full rounded-xl mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
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
        <div className="m3-scaffold flex-row">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="ml-24 flex-1 p-8">
                {/* M3 Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="headline-medium text-grey-900">Inventory</h1>
                        <p className="label-medium text-grey-500 uppercase tracking-widest mt-1">Stock Management</p>
                    </div>
                    <div className="m3-chip card-outlined h-10 px-4">
                        <Package size={18} className="mr-2" />
                        <span className="label-medium font-bold text-grey-700">{products.length} PRODUCTS</span>
                    </div>
                </header>

                {/* M3 Search Bar */}
                <div className="relative mb-12">
                    <input
                        type="text"
                        placeholder="Search products by name or code..."
                        className="m3-text-field pl-14"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-400">
                        <Search size={22} />
                    </div>
                </div>

                {/* Product Multi-Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
                    {filteredProducts.map((p) => (
                        <div key={p.id} className="m3-card card-elevated flex flex-col gap-6 group relative border border-md-sys-color-outline-variant">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-md-sys-color-surface-variant rounded-xl flex items-center justify-center text-grey-400 group-hover:text-primary transition-colors">
                                        <Package size={28} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="title-medium text-grey-900 truncate">{p.product_name}</h3>
                                        <p className="label-medium text-grey-500 uppercase tracking-widest">{p.product_code}</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center state-layer ${p.barcode_enabled ? 'text-success' : 'text-grey-300'}`}>
                                    {p.barcode_enabled ? <Check size={20} /> : <EyeOff size={20} />}
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-md-sys-color-surface-variant p-4 rounded-xl">
                                <div>
                                    <p className="label-medium text-grey-500 uppercase tracking-widest mb-1">Price</p>
                                    <p className="title-large text-grey-900 font-bold">₹{p.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="label-medium text-grey-500 uppercase tracking-widest mb-1">Stock</p>
                                    <div className={`m3-chip border-none h-6 px-2 ${p.stock < 10 ? 'bg-md-sys-color-error-container text-md-sys-color-on-error-container' : 'btn-tonal'}`}>
                                        <span className="text-[10px] font-bold">{p.stock} UNITS</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Action Overlay (M3 Style) */}
                            <div className="absolute inset-0 bg-md-sys-color-surface/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-[var(--md-sys-shape-md)] z-10 border border-primary/20 shadow-lg">
                                <button
                                    className="m3-btn btn-filled h-14 w-14 p-0 shadow-md"
                                    onClick={() => handleEdit(p)}
                                >
                                    <Edit3 size={24} />
                                </button>
                                <button
                                    className={`m3-btn h-14 w-14 p-0 shadow-md ${p.barcode_enabled ? 'btn-tonal text-md-sys-color-error' : 'btn-filled'}`}
                                    onClick={() => toggleProductStatus(p.id)}
                                >
                                    {p.barcode_enabled ? <EyeOff size={24} /> : <Eye size={24} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 opacity-40">
                        <Search size={64} className="text-grey-300 mb-4" />
                        <p className="body-large text-grey-500">No products found matching your search</p>
                    </div>
                )}

                {/* M3 Edit Modal */}
                {editingProduct && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
                        <div className="m3-card card-elevated w-full max-w-sm p-8 shadow-2xl relative animate-slide-up border border-md-sys-color-outline-variant">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="label-medium text-primary font-bold uppercase tracking-widest mb-1">Edit Product</p>
                                    <h2 className="title-large text-grey-900">{editingProduct.product_name}</h2>
                                    <p className="label-medium text-grey-500 uppercase">{editingProduct.product_code}</p>
                                </div>
                                <button
                                    className="w-10 h-10 flex items-center justify-center state-layer rounded-full"
                                    onClick={() => setEditingProduct(null)}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="label-medium text-grey-500 uppercase tracking-widest ml-1">Sale Price (₹)</label>
                                    <input
                                        type="number"
                                        className="m3-text-field text-xl font-bold"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="label-medium text-grey-500 uppercase tracking-widest ml-1">Stock Level</label>
                                    <input
                                        type="number"
                                        className="m3-text-field text-xl font-bold"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    className="m3-btn btn-tonal flex-1 h-14 font-bold"
                                    onClick={() => setEditingProduct(null)}
                                >
                                    CANCEL
                                </button>
                                <button
                                    className="m3-btn btn-filled flex-1 h-14 font-bold shadow-md"
                                    onClick={handleSave}
                                >
                                    SAVE
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
