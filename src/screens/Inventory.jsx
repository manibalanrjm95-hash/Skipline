import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Plus, Edit3, Trash2, Eye, EyeOff, Package, Menu, X, Check, AlertCircle } from 'lucide-react';
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
            <div className="flex bg-grey-50 min-h-screen">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="ml-64 flex-1 p-10 animate-fade admin-content">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <Skeleton className="h-14 w-full rounded-2xl mb-8" />
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
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
        <div className="admin-layout flex min-h-screen relative overflow-hidden bg-grey-50">
            {/* Helixion V4 Mesh Background */}
            <div className="mesh-bg"></div>

            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="ml-64 flex-1 p-10 animate-fade-in relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-12 flex-col-mobile gap-4">
                    <div className="flex items-center gap-6 w-full animate-slide-up">
                        <button
                            className="lg:hidden p-4 bg-white rounded-2xl shadow-lg text-grey-600 magnetic-btn"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <p className="caption text-primary mb-1 tracking-[0.3em] font-black">LOGISTICS</p>
                            <h1 className="text-display text-grey-900 leading-tight font-black">Stock Control</h1>
                        </div>
                    </div>
                </div>

                {/* Search & Actions Bar */}
                <div className="glass-card p-3 rounded-[32px] shadow-xl mb-12 flex gap-4 border-white/80 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex-1 bg-grey-100/50 rounded-2xl flex items-center px-6 transition-all focus-within:bg-white focus-within:shadow-inner">
                        <Search size={24} className="text-grey-400 mr-4" strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            className="bg-transparent py-5 w-full text-lg font-black text-grey-900 outline-none placeholder:text-grey-400 placeholder:font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Product List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-24">
                    {filteredProducts.map((p, index) => (
                        <div key={p.id}
                            className="card-premium p-8 bg-white border-white/80 hover:border-primary/20 group relative flex flex-col gap-6 animate-slide-up"
                            style={{ animationDelay: `${0.2 + index * 0.05}s` }}>

                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-18 h-18 bg-grey-100/50 rounded-[24px] flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                                        <Package size={36} className="text-grey-300 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-grey-900 text-xl leading-tight mb-1 truncate" title={p.product_name}>{p.product_name}</h3>
                                        <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest">{p.product_code}</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${p.barcode_enabled ? 'bg-success-bg text-success' : 'bg-grey-100 text-grey-400'}`}>
                                    {p.barcode_enabled ? <Check size={20} strokeWidth={3} /> : <EyeOff size={20} strokeWidth={2} />}
                                </div>
                            </div>

                            <div className="flex items-end justify-between mt-auto bg-grey-50/50 p-5 rounded-2xl border border-grey-100/30">
                                <div>
                                    <p className="text-[10px] font-black text-grey-400 mb-1 uppercase tracking-widest">Pricing</p>
                                    <p className="text-3xl font-black text-grey-900 tracking-tighter">₹{p.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-grey-400 mb-1 uppercase tracking-widest">Inventory</p>
                                    <span className={`inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide ${p.stock < 10 ? 'text-error' : 'text-success'}`}>
                                        {p.stock < 10 && <AlertCircle size={14} strokeWidth={3} />}
                                        {p.stock} Units
                                    </span>
                                </div>
                            </div>

                            {/* Hover Actions Overlay */}
                            <div className="absolute inset-2 bg-white/95 backdrop-blur-md rounded-[30px] flex items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-grey-100/50 shadow-2xl">
                                <button
                                    className="w-16 h-16 bg-white text-grey-700 rounded-2xl shadow-lg border border-grey-100 flex items-center justify-center magnetic-btn hover:text-primary transition-all"
                                    onClick={() => handleEdit(p)}
                                >
                                    <Edit3 size={32} strokeWidth={2.5} />
                                </button>
                                <button
                                    className={`w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center border transition-all magnetic-btn ${p.barcode_enabled ? 'bg-white text-grey-400 border-grey-100 hover:text-error' : 'bg-success text-white border-success shadow-success/20'}`}
                                    onClick={() => toggleProductStatus(p.id)}
                                >
                                    {p.barcode_enabled ? <EyeOff size={32} strokeWidth={2.5} /> : <Eye size={32} strokeWidth={2.5} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 opacity-20">
                        <div className="w-32 h-32 bg-grey-100 rounded-[40px] flex items-center justify-center mb-8">
                            <Search size={64} className="text-grey-400" strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black text-grey-900 tracking-tight">No Items Found</h3>
                        <p className="text-sm font-bold text-grey-500 uppercase tracking-widest mt-2">Check filters or spelling</p>
                    </div>
                )}

                {/* Edit Modal */}
                {editingProduct && (
                    <div className="fixed inset-0 bg-grey-900/40 backdrop-blur-xl flex items-center justify-center z-[100] animate-fade-in p-6">
                        <div className="glass-card w-full max-w-lg p-10 shadow-float border-white relative overflow-hidden animate-slide-up">
                            {/* Accent Background Blobs */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                            <button
                                className="absolute top-8 right-8 w-11 h-11 bg-white/50 rounded-2xl text-grey-400 hover:text-grey-900 transition-all flex items-center justify-center hover:bg-white hover:shadow-lg"
                                onClick={() => setEditingProduct(null)}
                            >
                                <X size={24} strokeWidth={3} />
                            </button>

                            <div className="flex justify-between items-start mb-12 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-primary mb-1 uppercase tracking-[0.3em]">UPDATE RECORD</p>
                                    <h2 className="text-3xl font-black text-grey-900 tracking-tighter mb-1">{editingProduct.product_name}</h2>
                                    <p className="text-xs font-bold text-grey-400 uppercase tracking-widest">{editingProduct.product_code}</p>
                                </div>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-grey-400 uppercase tracking-widest ml-1">Unit Price (₹)</label>
                                    <input
                                        type="number"
                                        className="input-field bg-white/50 backdrop-blur-sm py-6 text-2xl font-black"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-grey-400 uppercase tracking-widest ml-1">Current Stock Count</label>
                                    <input
                                        type="number"
                                        className="input-field bg-white/50 backdrop-blur-sm py-6 text-2xl font-black"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-6 mt-12 relative z-10">
                                <button
                                    className="flex-1 py-5 rounded-2xl font-black text-sm text-grey-400 hover:text-grey-900 hover:bg-white/50 transition-all uppercase tracking-widest magnetic-btn"
                                    onClick={() => setEditingProduct(null)}
                                >
                                    Discard
                                </button>
                                <button
                                    className="flex-[2] btn btn-primary py-5 shadow-primary rounded-2xl font-black text-lg magnetic-btn uppercase tracking-widest"
                                    onClick={handleSave}
                                >
                                    APPLY CHANGES
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
