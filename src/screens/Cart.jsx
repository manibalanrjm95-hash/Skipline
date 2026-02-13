import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, ShoppingBag, Trash2, Minus, Plus, ChevronRight, Package } from 'lucide-react';
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

    return (
        <div className="m3-scaffold">
            {/* M3 Top App Bar */}
            <header className="m3-top-app-bar shadow-sm">
                <button
                    className="w-10 h-10 flex items-center justify-center state-layer rounded-full"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={24} className="text-grey-900" />
                </button>
                <h2 className="title-large text-grey-900 flex-1">My Cart</h2>
                <div className="m3-chip btn-tonal border-none h-8 px-3">
                    <span className="label-medium font-bold text-primary">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
                    </span>
                </div>
            </header>

            <main className="m3-content pb-48">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20">
                        <div className="w-24 h-24 bg-md-sys-color-surface-variant rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={48} className="text-grey-300" />
                        </div>
                        <h3 className="headline-small text-grey-900 mb-2">Your cart is empty</h3>
                        <p className="body-large text-grey-600 mb-8 max-w-[240px]">
                            Scan items as you shop to see them here.
                        </p>
                        <button
                            className="m3-btn btn-filled h-12 px-8"
                            onClick={() => navigate('/scan')}
                        >
                            Start Scanning
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {cart.map((item) => (
                            <div key={item.product_id} className="m3-card card-outlined flex items-center gap-4">
                                <div className="w-14 h-14 bg-md-sys-color-surface-variant rounded-lg flex items-center justify-center shrink-0">
                                    <Package size={24} className="text-grey-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="title-medium text-grey-900 truncate">{item.product_name}</h3>
                                    <p className="label-medium text-grey-500">₹{Number(item.price).toFixed(0)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1 bg-md-sys-color-secondary-container rounded-lg p-0.5">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center state-layer"
                                            onClick={() => handleUpdateQuantity(item.product_id, -1)}
                                        >
                                            {item.quantity === 1 ? <Trash2 size={16} className="text-error" /> : <Minus size={16} />}
                                        </button>
                                        <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center state-layer text-primary"
                                            onClick={() => handleUpdateQuantity(item.product_id, 1)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <span className="label-large font-bold text-primary">₹{Number(item.subtotal).toFixed(0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* M3 Sticky Bottom Sheet (Simplified as a Tonal Surface) */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-md-sys-color-surface-variant p-6 shadow-float rounded-t-3xl border-t border-md-sys-color-outline-variant z-50">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="label-medium text-grey-500 uppercase tracking-widest mb-1">Total Amount</p>
                            <h2 className="display-small text-grey-900 font-bold">₹{cartTotal.toFixed(0)}</h2>
                        </div>
                        <div className="text-right">
                            <div className="m3-chip bg-md-sys-color-primary-container text-md-sys-color-on-primary-container border-none shadow-sm">
                                <span className="label-medium font-bold uppercase">PAYABLE</span>
                            </div>
                        </div>
                    </div>

                    <button
                        className="m3-btn btn-filled w-full h-16 text-lg font-bold shadow-lg flex justify-between px-8"
                        onClick={() => navigate('/payment-method')}
                    >
                        <span>Checkout Now</span>
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}

            {cart.length === 0 && <BottomNav />}
        </div>
    );
};

export default Cart;
