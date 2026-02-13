import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, ShoppingBag, Trash2, Minus, Plus, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useToast } from '../context/ToastContext';

const Cart = () => {
    const { cart, cartTotal, updateQuantity } = useStore();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleUpdateQuantity = (id, delta) => {
        const item = cart.find(i => i.product_id === id);
        if (item && item.quantity === 1 && delta === -1) {
            addToast('Item removed from cart', 'info');
        }
        updateQuantity(id, delta);
    };

    // Functional Rule: Prevent NaN and fallback to 0
    const formatCurrency = (amount) => {
        const value = Number(amount);
        return isNaN(value) ? '₹0.00' : `₹${value.toFixed(2)}`;
    };

    return (
        <div className="max-app-width flex flex-col bg-bg-app">
            <header className="page-padding pt-8 pb-4 bg-bg-app sticky top-0 z-20 border-b border-border">
                <div className="flex items-center gap-4">
                    <button
                        className="w-10 h-10 flex items-center justify-center text-text-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="h1 text-text-primary">My Cart</h1>
                    <div className="ml-auto label font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        {cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)} Items
                    </div>
                </div>
            </header>

            <main className="page-padding flex flex-col gap-4 pb-48">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-32">
                        <div className="w-20 h-20 bg-border/20 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={40} className="text-border" />
                        </div>
                        <h2 className="h2 text-text-primary mb-2">Cart is empty</h2>
                        <p className="body text-text-secondary mb-8">Ready to start shopping?</p>
                        <button
                            className="btn-v2 btn-v2-primary max-w-xs"
                            onClick={() => navigate('/scan')}
                        >
                            Start Scanning
                        </button>
                    </div>
                ) : (
                    cart.map((item) => {
                        // Functional Rule: Subtotal Math Fix
                        const subtotal = Number(item.price) * Number(item.quantity) || 0;

                        return (
                            <div key={item.product_id} className="card-v2 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="h3 text-text-primary">{item.product_name}</h3>
                                        <p className="label font-bold text-primary mt-1">{formatCurrency(item.price)} each</p>
                                    </div>
                                    <h3 className="h3 font-bold text-text-primary text-right">
                                        {formatCurrency(subtotal)}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                                    <p className="small text-text-secondary">Quantity</p>
                                    <div className="flex items-center bg-bg-app rounded-full p-1 gap-4 px-2">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center bg-surface border border-border rounded-full text-text-secondary shadow-sm active:scale-90 transition-transform"
                                            onClick={() => handleUpdateQuantity(item.product_id, -1)}
                                        >
                                            {item.quantity === 1 ? <Trash2 size={16} className="text-error" /> : <Minus size={16} />}
                                        </button>
                                        <span className="body font-bold min-w-[12px] text-center">{item.quantity}</span>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center bg-surface border border-border rounded-full text-primary shadow-sm active:scale-90 transition-transform"
                                            onClick={() => handleUpdateQuantity(item.product_id, 1)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </main>

            {/* Sticky Checkout Bar */}
            {cart.length > 0 && (
                <div className="sticky-bar-v2 flex flex-col gap-6">
                    <div className="flex justify-between items-end px-1">
                        <div>
                            <p className="label text-text-secondary uppercase tracking-[0.2em] mb-1">Total Amount</p>
                            <h2 className="h1 text-text-primary" style={{ fontSize: '32px' }}>
                                {formatCurrency(cartTotal)}
                            </h2>
                        </div>
                        <div className="text-right">
                            <span className="label font-bold text-success uppercase tracking-widest">Calculated</span>
                        </div>
                    </div>

                    <button
                        className="btn-v2 btn-v2-primary flex justify-between items-center px-8"
                        onClick={() => navigate('/payment-method')}
                    >
                        <span>Checkout</span>
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}

            {cart.length === 0 && <BottomNav />}
        </div>
    );
};

export default Cart;
