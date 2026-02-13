import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Plus, Minus, ShoppingBag, X, ScanLine } from 'lucide-react';
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
            <div className="m3-scaffold">
                <div className="m3-top-app-bar shadow-sm">
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="m3-content">
                    <Skeleton className="h-12 w-full mb-6 rounded-md" />
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="m3-scaffold pb-24">
            {/* M3 Top App Bar */}
            <header className="m3-top-app-bar shadow-sm sticky top-0 z-50">
                <div className="flex-1">
                    <h2 className="title-large text-grey-900">{currentShop?.shop_name || 'SkipLine Store'}</h2>
                    <p className="label-medium text-grey-500">Live Store · Welcome</p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center state-layer rounded-full">
                    <ShoppingBag size={24} className="text-primary" />
                </div>
            </header>

            <main className="m3-content">
                {/* M3 Search Field */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="m3-text-field"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {searchTerm ? (
                            <X size={20} className="text-grey-400 cursor-pointer" onClick={() => setSearchTerm('')} />
                        ) : (
                            <Search size={20} className="text-grey-400" />
                        )}
                    </div>
                </div>

                {/* Hero Greeting */}
                {!searchTerm && (
                    <div className="mb-8">
                        <h1 className="headline-medium text-grey-900 mb-2">Featured Items</h1>
                        <p className="body-large text-grey-600">Handpicked items for your daily needs.</p>
                    </div>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.map((product) => {
                        const qty = getCartDelay(product.id);
                        const isOutOfStock = product.stock <= 0;

                        return (
                            <div key={product.id} className="m3-card card-elevated flex flex-col state-layer h-full">
                                {/* Image Placeholder / Container */}
                                <div className="w-full aspect-square bg-md-sys-color-surface-variant rounded-lg mb-4 flex items-center justify-center relative">
                                    <ShoppingBag size={32} className="text-grey-300" />
                                    {qty > 0 && (
                                        <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                            {qty}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <h3 className="title-medium text-grey-900 leading-tight mb-1 truncate">{product.product_name}</h3>
                                    <p className="label-medium text-grey-500 uppercase tracking-wider mb-4">{product.product_code}</p>

                                    {isOutOfStock ? (
                                        <div className="m3-chip bg-md-sys-color-error-container text-md-sys-color-on-error-container border-none h-6 mt-auto">
                                            <span className="text-[10px] font-bold">OUT OF STOCK</span>
                                        </div>
                                    ) : (
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="title-large text-grey-900">₹{Number(product.price).toFixed(0)}</span>

                                            {qty === 0 ? (
                                                <button
                                                    className="m3-btn btn-filled h-10 w-10 p-0 rounded-xl"
                                                    onClick={() => handleAddToCart(product)}
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1 bg-md-sys-color-secondary-container rounded-lg p-0.5">
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center state-layer text-grey-600"
                                                        onClick={() => updateQuantity(product.id, -1)}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="text-sm font-bold min-w-[20px] text-center">{qty}</span>
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center state-layer text-primary"
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={product.stock <= qty}
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 opacity-50">
                        <ShoppingBag size={64} className="mb-4 text-grey-300" strokeWidth={1} />
                        <p className="body-large text-grey-500">No products match your search</p>
                    </div>
                )}
            </main>

            {/* M3 Extended FAB */}
            <button
                className="m3-fab m3-fab-extended fixed bottom-28 right-6 z-50 state-layer"
                onClick={() => navigate('/scan')}
            >
                <ScanLine size={24} />
                <span className="label-large font-bold">SCAN PRODUCT</span>
            </button>

            <BottomNav />
        </div>
    );
};

export default Dashboard;
