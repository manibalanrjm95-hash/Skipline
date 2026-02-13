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
        <div className="app-container flex flex-col">
            <div className="screen-padding pb-32 animate-fade-in">

                {/* Header Section */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="caption text-primary mb-1">Shopping At</p>
                        <h1 className="text-h1 text-grey-900 leading-tight">
                            {currentShop?.shop_name || 'SkipLine Store'}
                        </h1>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-grey-100">
                        <ShoppingBag size={20} className="text-grey-900" />
                    </div>
                </div>

                {/* Hero / Start Scanning Card */}
                {!searchTerm && (
                    <div className="card-premium bg-grey-900 text-white mb-8 relative overflow-hidden group border-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold mb-2">Ready to shop?</h2>
                                <p className="text-grey-400">Scan products to add them to your cart instantly.</p>
                            </div>
                            <button
                                onClick={() => navigate('/scan')}
                                className="w-full bg-white text-grey-900 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                            >
                                <ScanLine size={24} /> Start Scanning
                            </button>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="relative mb-8 z-20">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-grey-400" size={22} />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="input-field pl-14 shadow-sm border-none bg-white"
                        style={{ borderRadius: '20px' }}
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
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-h2">Featured Items</h3>
                        <button className="text-primary font-bold text-sm">See All</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map(product => {
                            const qty = getCartDelay(product.id);
                            const isOutOfStock = product.stock <= 0;

                            return (
                                <div key={product.id} className="card-action bg-white p-4 items-start text-left h-auto relative overflow-hidden group border-transparent hover:border-primary/20">
                                    {/* Image Area */}
                                    <div className="w-full aspect-square bg-grey-100 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center">
                                        <ShoppingBag size={32} className="text-grey-300" />
                                        {qty > 0 && (
                                            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                                                x{qty}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="w-full">
                                        <h3 className="text-lg font-bold text-grey-900 leading-tight mb-1 truncate">{product.product_name}</h3>
                                        <p className="body-sm text-grey-500 mb-3">{product.product_code}</p>

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xl font-extrabold text-grey-900">₹{Number(product.price).toFixed(0)}</span>

                                            {qty === 0 ? (
                                                <button
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOutOfStock
                                                        ? 'bg-grey-100 text-grey-300'
                                                        : 'bg-grey-900 text-white shadow-lg active:scale-90 hover:bg-primary'}`}
                                                    onClick={() => !isOutOfStock && handleAddToCart(product)}
                                                    disabled={isOutOfStock}
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 bg-grey-100 rounded-full p-1 pr-3">
                                                    <button
                                                        className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center"
                                                        onClick={() => updateQuantity(product.id, -1)}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="font-bold text-sm">{qty}</span>
                                                    <button
                                                        className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-primary"
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={product.stock <= qty}
                                                    >
                                                        <Plus size={16} />
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
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <ShoppingBag size={48} className="mb-4 text-grey-300" />
                        <p className="font-bold text-grey-400">No products found</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
};

export default Dashboard;
