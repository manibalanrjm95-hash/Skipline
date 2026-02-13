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
            <div className="m3-scaffold">
                <main className="m3-content">
                    <Skeleton className="h-10 w-48 mb-8" />
                    <Skeleton className="h-14 w-full rounded-full mb-12" />
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-[28px]" />)}
                    </div>
                </main>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="m3-scaffold flex flex-col pb-32">
            <header className="page-padding pt-8 pb-4 bg-md-sys-color-surface sticky top-0 z-20">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="headline-small text-md-sys-color-on-surface">{currentShop?.shop_name || 'SkipLine Store'}</h1>
                        <p className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest mt-1">Live Shopping</p>
                    </div>
                    <div className="w-12 h-12 m3-card card-tonal rounded-full flex items-center justify-center text-md-sys-color-on-secondary-container">
                        <ShoppingBag size={24} />
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="m3-text-field rounded-full px-12 border-none"
                        style={{ borderRadius: '28px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-md-sys-color-on-surface-variant opacity-60">
                        <Search size={20} />
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-md-sys-color-on-surface-variant"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </header>

            <main className="m3-content flex flex-col gap-4">
                {filteredProducts.map((product) => {
                    const qty = getCartDelay(product.id);
                    const isOutOfStock = product.stock <= 0;

                    return (
                        <div key={product.id} className="m3-card card-elevated flex justify-between items-center group state-layer">
                            <div className="flex flex-col gap-0.5">
                                <h3 className="title-medium text-md-sys-color-on-surface">{product.product_name}</h3>
                                <p className="label-small text-md-sys-color-on-surface-variant uppercase tracking-wider mb-1">{product.product_code}</p>
                                <p className="title-large text-md-sys-color-primary">₹{Number(product.price).toFixed(0)}</p>
                            </div>

                            <div className="flex items-center">
                                {isOutOfStock ? (
                                    <div className="m3-chip border-md-sys-color-error text-md-sys-color-error">
                                        OUT OF STOCK
                                    </div>
                                ) : (
                                    <button
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${qty > 0 ? 'bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container' : 'bg-md-sys-color-primary text-white'
                                            }`}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        {qty > 0 ? (
                                            <span className="font-bold text-base">{qty}</span>
                                        ) : (
                                            <Plus size={24} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <ShoppingBag size={48} className="mb-4 text-md-sys-color-on-surface-variant" />
                        <p className="body-large text-md-sys-color-on-surface-variant">No items found</p>
                    </div>
                )}
            </main>

            {/* M3 Extended FAB */}
            <div className="fixed bottom-28 right-4 z-50">
                <button
                    onClick={() => navigate('/scan')}
                    className="flex items-center gap-4 bg-md-sys-color-primary-container text-md-sys-color-on-primary-container h-16 px-6 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-95 group"
                >
                    <div className="p-1 rounded-full group-hover:bg-md-sys-color-primary group-hover:text-white transition-colors">
                        <ScanLine size={24} strokeWidth={2.5} />
                    </div>
                    <span className="label-large font-bold tracking-widest uppercase">Scan Product</span>
                </button>
            </div>

            <BottomNav />
        </div>
    );
};

export default Dashboard;
