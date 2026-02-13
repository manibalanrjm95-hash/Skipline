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
        <div className="flex bg-grey-50 min-h-screen">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="ml-64 flex-1 p-10 animate-fade-in transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 flex-col-mobile gap-4">
                    <div className="flex items-center gap-4 w-full">
                        <button
                            className="lg:hidden p-3 bg-white rounded-xl shadow-sm text-grey-600"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <p className="caption text-grey-400 mb-1">INVENTORY</p>
                            <h1 className="text-display text-grey-900 leading-tight">Stock Control</h1>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-[24px] shadow-sm mb-8 flex gap-2 border border-grey-100">
                    <div className="flex-1 bg-grey-50 rounded-2xl flex items-center px-6 transition-all focus-within:ring-2 focus-within:ring-primary/10">
                        <Search size={24} className="text-grey-400 mr-4" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent py-4 w-full text-lg font-bold text-grey-900 outline-none placeholder:text-grey-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* <button className="btn btn-primary px-8 rounded-2xl shadow-lg flex items-center gap-2 font-bold whitespace-nowrap">
                        <Plus size={24} /> <span className="hidden md:inline">Add Product</span>
                    </button> */}
                </div>

                {/* Product List (Card Grid for better responsiveness) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                    {filteredProducts.map(p => (
                        <div key={p.id} className="card-premium p-6 bg-white border-transparent hover:border-grey-200 group relative flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-grey-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Package size={32} className="text-grey-300" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-grey-900 text-lg leading-tight mb-1 truncate max-w-[150px]" title={p.product_name}>{p.product_name}</h3>
                                        <p className="text-xs font-bold text-grey-400 uppercase tracking-widest">{p.product_code}</p>
                                    </div>
                                </div>
                                <div className={`p-2 rounded-xl ${p.barcode_enabled ? 'bg-success/10 text-success' : 'bg-grey-100 text-grey-400'}`}>
                                    {p.barcode_enabled ? <Check size={20} /> : <EyeOff size={20} />}
                                </div>
                            </div>

                            <div className="flex items-end justify-between mt-auto">
                                <div>
                                    <p className="caption text-grey-400 mb-1">PRICE</p>
                                    <p className="text-2xl font-black text-grey-900">₹{p.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="caption text-grey-400 mb-1">STOCK</p>
                                    <span className={`inline-flex items-center gap-1.5 font-bold ${p.stock < 10 ? 'text-error' : 'text-success'}`}>
                                        {p.stock < 10 && <AlertCircle size={14} />}
                                        {p.stock} units
                                    </span>
                                </div>
                            </div>

                            {/* Hover Actions Overlay */}
                            <div className="absolute inset-2 bg-white/95 backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-grey-100">
                                <button
                                    className="p-4 bg-grey-100 text-grey-600 rounded-2xl hover:bg-white hover:shadow-md hover:scale-110 transition-all border border-transparent hover:border-grey-100"
                                    onClick={() => handleEdit(p)}
                                    title="Edit Details"
                                >
                                    <Edit3 size={24} />
                                </button>
                                <button
                                    className={`p-4 rounded-2xl hover:shadow-md hover:scale-110 transition-all border border-transparent ${p.barcode_enabled ? 'bg-grey-100 text-grey-600 hover:bg-error/10 hover:text-error' : 'bg-success/10 text-success hover:bg-success hover:text-white'}`}
                                    onClick={() => toggleProductStatus(p.id)}
                                    title={p.barcode_enabled ? 'Disable Scanning' : 'Enable Scanning'}
                                >
                                    {p.barcode_enabled ? <EyeOff size={24} /> : <Eye size={24} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                        <div className="w-24 h-24 bg-grey-100 rounded-full flex items-center justify-center mb-6">
                            <Search size={40} className="text-grey-400" />
                        </div>
                        <h3 className="text-xl font-bold text-grey-900">No products found</h3>
                        <p className="text-grey-500 font-medium">Try checking your spelling or filters.</p>
                    </div>
                )}

                {/* Edit Modal */}
                {editingProduct && (
                    <div className="fixed inset-0 bg-grey-900/60 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in p-4">
                        <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl transform transition-all scale-100 border border-white/50 relative overflow-hidden">
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                            <button
                                className="absolute top-6 right-6 p-2 bg-grey-50 rounded-full text-grey-400 hover:bg-grey-100 hover:text-grey-900 transition-colors"
                                onClick={() => setEditingProduct(null)}
                            >
                                <X size={24} />
                            </button>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-grey-900 mb-1">Edit Product</h2>
                                    <p className="text-sm font-bold text-grey-500">{editingProduct.product_name}</p>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="caption ml-1">Unit Price (₹)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="caption ml-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 relative z-10">
                                <button
                                    className="flex-1 py-4 rounded-xl font-bold text-grey-500 hover:bg-grey-50 transition-colors"
                                    onClick={() => setEditingProduct(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-[2] btn btn-primary py-4 shadow-primary rounded-xl"
                                    onClick={handleSave}
                                >
                                    Save Changes
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
