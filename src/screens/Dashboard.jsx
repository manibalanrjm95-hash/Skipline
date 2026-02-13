import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Plus, ShoppingBag, X, ScanLine } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { products, loading, addToCart, cart, currentShop } = useStore();
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
            <div className="max-app-width flex flex-col bg-bg-app">
                <div className="page-padding">
                    <Skeleton className="h-8 w-48 mb-8" />
                    <Skeleton className="h-14 w-full rounded-xl mb-12" />
                    <div className="section-gap">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="max-app-width flex flex-col pb-32">
            {/* Header */}
            <header className="page-padding pt-8 pb-4 bg-bg-app sticky top-0 z-20">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="h1 text-text-primary">{currentShop?.shop_name || 'SkipLine Store'}</h1>
                        <p className="label text-text-secondary uppercase tracking-widest mt-1">Live Shopping</p>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center text-text-primary">
                        <ShoppingBag size={24} />
                    </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="input-v2 pl-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-60">
                        <Search size={20} />
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </header>

            <main className="page-padding flex flex-col gap-4">
                {filteredProducts.map((product) => {
                    const qty = getCartDelay(product.id);
                    const isOutOfStock = product.stock <= 0;

                    return (
                        <div key={product.id} className="card-v2 flex justify-between items-center">
                            {/* Left: Product Info */}
                            <div className="flex flex-col gap-0.5">
                                <h3 className="h3 text-text-primary leading-tight">{product.product_name}</h3>
                                <p className="small text-text-secondary uppercase tracking-wider mb-1">{product.product_code}</p>
                                <p className="body font-bold text-text-primary">₹{Number(product.price).toFixed(2)}</p>
                            </div>

                            {/* Right: Add Button */}
                            <div className="flex items-center">
                                {isOutOfStock ? (
                                    <span className="label font-bold text-error bg-error/10 px-3 py-1.5 rounded-full">OUT OF STOCK</span>
                                ) : (
                                    <button
                                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${qty > 0 ? 'bg-secondary text-white' : 'bg-primary text-white'
                                            }`}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        {qty > 0 ? (
                                            <span className="font-bold text-sm">{qty}</span>
                                        ) : (
                                            <Plus size={20} strokeWidth={3} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <ShoppingBag size={48} className="mb-4 text-text-secondary" />
                        <p className="body text-text-secondary">No items found</p>
                    </div>
                )}
            </main>

            {/* Float Action Button - Adjusted for V2 */}
            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-app-width px-5">
                <button
                    onClick={() => navigate('/scan')}
                    className="btn-v2 btn-v2-secondary shadow-lg flex items-center justify-center gap-2"
                >
                    <ScanLine size={24} />
                    <span>SCAN TO ADD</span>
                </button>
            </div>

            <BottomNav />
        </div>
    );
};

export default Dashboard;
