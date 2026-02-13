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
        updateQuantity(id, delta);
    };

    const formatCurrency = (amount) => {
        const value = Number(amount);
        return isNaN(value) ? '₹0' : `₹${value.toFixed(0)}`;
    };

    return (
        <div className="m3-scaffold flex flex-col">
            <header className="page-padding pt-8 pb-4 bg-md-sys-color-surface sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        className="w-12 h-12 flex items-center justify-center text-md-sys-color-on-surface-variant state-layer rounded-full"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="headline-small text-md-sys-color-on-surface">My Cart</h1>
                    <div className="ml-auto m3-chip btn-tonal border-none h-8 px-3">
                        <span className="label-medium font-bold">{cart.reduce((acc, item) => acc + item.quantity, 0)} Items</span>
                    </div>
                </div>
            </header>

            <main className="m3-content flex flex-col gap-4 pb-48">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-32 opacity-40">
                        <div className="w-20 h-20 m3-card card-filled rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="headline-small text-md-sys-color-on-surface-variant mb-2">Cart is empty</h2>
                        <button
                            className="m3-btn btn-filled mt-8 max-w-[200px]"
                            onClick={() => navigate('/dashboard')}
                        >
                            START SHOPPING
                        </button>
                    </div>
                ) : (
                    cart.map((item) => {
                        const subtotal = Number(item.price) * Number(item.quantity) || 0;

                        return (
                            <div key={item.product_id} className="m3-card card-outlined flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="title-medium text-md-sys-color-on-surface">{item.product_name}</h3>
                                        <p className="label-small text-md-sys-color-primary mt-1 font-bold">{formatCurrency(item.price)} each</p>
                                    </div>
                                    <h3 className="title-large font-bold text-md-sys-color-on-surface text-right">
                                        {formatCurrency(subtotal)}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between mt-2 pt-4 border-t border-md-sys-color-outline-variant">
                                    <span className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest">Quantity</span>
                                    <div className="flex items-center bg-md-sys-color-surface-variant rounded-full p-1 gap-4 px-2">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center bg-md-sys-color-surface text-md-sys-color-on-surface rounded-full shadow-sm active:scale-90 transition-transform"
                                            onClick={() => handleUpdateQuantity(item.product_id, -1)}
                                        >
                                            {item.quantity === 1 ? <Trash2 size={16} className="text-md-sys-color-error" /> : <Minus size={16} />}
                                        </button>
                                        <span className="body-large font-bold min-w-[12px] text-center">{item.quantity}</span>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center bg-md-sys-color-surface text-md-sys-color-primary rounded-full shadow-sm active:scale-90 transition-transform"
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

            {/* M3 Sticky Bottom Sheet Bar */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-md-sys-color-surface-variant p-6 rounded-t-[28px] shadow-2xl z-[100] border-t border-md-sys-color-outline-variant">
                    <div className="flex justify-between items-end mb-6 px-1">
                        <div>
                            <p className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-[0.2em] mb-1">Total Amount</p>
                            <h2 className="display-small text-md-sys-color-on-surface font-bold">
                                {formatCurrency(cartTotal)}
                            </h2>
                        </div>
                        <div className="text-right">
                            <span className="m3-chip btn-tonal border-none h-6 px-2">
                                <span className="text-[10px] font-bold">SECURE CHECKOUT</span>
                            </span>
                        </div>
                    </div>

                    <button
                        className="m3-btn btn-filled h-16 text-lg font-bold shadow-lg flex justify-between items-center px-8"
                        onClick={() => navigate('/payment-method')}
                    >
                        <span>CHECKOUT NOW</span>
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}

            {cart.length === 0 && <BottomNav />}
        </div>
    );
};

export default Cart;
