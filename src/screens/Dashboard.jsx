import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Plus, Minus, ShoppingBag, X, ScanLine, ArrowRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { products, loading, addToCart, cart, updateQuantity, currentShop } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (products) {
            setFilteredProducts(
                products.filter(p =>
                    p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.product_code.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [products, searchTerm]);

    const handleAddToCart = async (product) => {
        await addToCart(product.product_code);
        addToast(`Added ${product.product_name}`, 'success');
    };

    const getCartDelay = (productId) => {
        const item = cart.find(i => i.product_id === productId);
        return item ? item.quantity : 0;
    };

    if (loading) {
        return (
            <div className="app-container flex flex-col">
                <div className="screen-padding pb-32">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-48" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-48 w-full rounded-[32px] mb-8" />
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-32 rounded-2xl flex-shrink-0" />)}
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="app-container flex flex-col relative overflow-hidden">
            {/* Helixion V4 Mesh Background */}
            <div className="mesh-bg"></div>

            <div className="screen-padding pb-32 animate-fade-in relative z-10">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-10">
                    <div className="animate-slide-up">
                        <p className="caption text-primary mb-1 tracking-[0.2em]">Live at</p>
                        <h1 className="text-h1 text-grey-900 leading-tight font-black">
                            {currentShop?.shop_name || 'SkipLine Store'}
                        </h1>
                    </div>
                    <div className="w-14 h-14 glass-card flex items-center justify-center magnetic-btn">
                        <ShoppingBag size={24} className="text-grey-900" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Hero / Start Scanning Card */}
                {!searchTerm && (
                    <div className="card-premium bg-grey-900 text-white mb-10 relative overflow-hidden group border-none shadow-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-700"></div>
                        <div className="relative z-10 p-2">
                            <div className="mb-8">
                                <h2 className="text-3xl font-black mb-2 tracking-tight">Ready to shop?</h2>
                                <p className="text-grey-400 font-medium">Scan items to fill your cart instantly.</p>
                            </div>
                            <button
                                onClick={() => navigate('/scan')}
                                className="w-full bg-white text-grey-900 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                            >
                                <ScanLine size={28} strokeWidth={3} /> START SCANNING
                            </button>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="relative mb-10 z-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-grey-400">
                        <Search size={24} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for items..."
                        className="input-field pl-16 py-5 shadow-lg border-white/50 bg-white/80 backdrop-blur-md"
                        style={{ borderRadius: '24px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-grey-100 rounded-full text-grey-500 hover:bg-grey-200 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Products Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-h2 font-black">Featured Products</h3>
                        <button className="text-primary font-black text-sm tracking-wide bg-primary/5 px-4 py-2 rounded-full">See All</button>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {filteredProducts.map((product, index) => {
                            const qty = getCartDelay(product.id);
                            const isOutOfStock = product.stock <= 0;

                            return (
                                <div
                                    key={product.id}
                                    className="glass-card p-5 items-start text-left h-auto relative group animate-slide-up"
                                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                                >
                                    {/* Image Area */}
                                    <div className="w-full aspect-square bg-grey-200/50 rounded-2xl mb-5 relative overflow-hidden flex items-center justify-center group-hover:bg-grey-200 transition-colors">
                                        <ShoppingBag size={40} className="text-grey-300 transform group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                                        {qty > 0 && (
                                            <div className="absolute top-3 right-3 bg-primary text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow-lg z-10 scale-110">
                                                {qty}
                                            </div>
                                        )}
                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-grey-900 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Out of Stock</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="w-full">
                                        <h3 className="text-lg font-black text-grey-900 leading-tight mb-1 truncate">{product.product_name}</h3>
                                        <p className="text-[10px] font-bold text-grey-400 uppercase tracking-widest mb-4">{product.product_code}</p>

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-2xl font-black text-grey-900">₹{Number(product.price).toFixed(0)}</span>

                                            {qty === 0 ? (
                                                <button
                                                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all magnetic-btn ${isOutOfStock
                                                        ? 'bg-grey-100 text-grey-300'
                                                        : 'bg-grey-900 text-white shadow-xl hover:bg-primary'}`}
                                                    onClick={() => !isOutOfStock && handleAddToCart(product)}
                                                    disabled={isOutOfStock}
                                                >
                                                    <Plus size={24} strokeWidth={3} />
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 bg-grey-200/50 rounded-2xl p-1 pr-3">
                                                    <button
                                                        className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center magnetic-btn"
                                                        onClick={() => updateQuantity(product.id, -1)}
                                                    >
                                                        <Minus size={18} strokeWidth={3} />
                                                    </button>
                                                    <span className="font-black text-sm px-1">{qty}</span>
                                                    <button
                                                        className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-primary magnetic-btn"
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={product.stock <= qty}
                                                    >
                                                        <Plus size={18} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 opacity-30">
                        <ShoppingBag size={64} className="mb-6 text-grey-400" strokeWidth={1} />
                        <p className="font-black text-grey-500 uppercase tracking-[0.2em] text-sm">No items found</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
};

export default Dashboard;
