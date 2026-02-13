import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, ShoppingBag, Trash2, Minus, Plus, Zap, ChevronRight, Package } from 'lucide-react';
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
        <div className="app-container flex flex-col h-screen">
            <div className="screen-padding flex-1 flex flex-col overflow-hidden pb-40">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8 flex-shrink-0 z-10 relative">
                    <button
                        className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-grey-900 hover:bg-grey-100 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-h1 text-grey-900">My Cart</h2>
                    <div className="ml-auto bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 animate-fade-in opacity-50">
                        <div className="w-32 h-32 bg-grey-100 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag size={48} className="text-grey-300" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-grey-900 mb-2">Cart is empty</h3>
                            <p className="body-md text-grey-500 max-w-xs mx-auto">Scan items to add them here.</p>
                        </div>
                        <button
                            className="btn btn-primary px-8 rounded-xl shadow-lg mt-4"
                            onClick={() => navigate('/scan')}
                        >
                            Start Scanning
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 flex-1 overflow-y-auto pb-4 pr-1 hide-scrollbar">
                        {cart.map((item) => (
                            <div key={item.product_id} className="card-floating p-4 bg-white relative group border-transparent hover:border-grey-200">
                                {/* Icon / Image */}
                                <div className="w-16 h-16 bg-grey-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Package size={24} className="text-grey-400" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 ml-4 mr-2">
                                    <h3 className="font-bold text-grey-900 text-lg leading-tight mb-1">{item.product_name}</h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-grey-500 font-medium">₹{Number(item.price).toFixed(0)}</p>
                                        <div className="w-1 h-1 bg-grey-300 rounded-full"></div>
                                        <p className="text-primary font-extrabold text-sm">Total: ₹{Number(item.subtotal).toFixed(0)}</p>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-3 bg-grey-50 rounded-full p-1 pl-3 shadow-inner">
                                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                        <div className="flex gap-1">
                                            <button
                                                className="w-7 h-7 bg-white rounded-full shadow-sm flex items-center justify-center text-grey-600 active:scale-90 transition-transform"
                                                onClick={() => handleUpdateQuantity(item.product_id, -1)}
                                            >
                                                {item.quantity === 1 ? <Trash2 size={14} className="text-error" /> : <Minus size={14} />}
                                            </button>
                                            <button
                                                className="w-7 h-7 bg-white rounded-full shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform"
                                                onClick={() => handleUpdateQuantity(item.product_id, 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sticky Checkout Sheet */}
            {cart.length > 0 && (
                <div className="absolute bottom-0 left-0 w-full z-100 p-6 pt-8 bg-white rounded-t-[40px] shadow-[0_-10px_60px_rgba(0,0,0,0.15)] animate-slide-up border-t border-white/50">
                    <div className="w-12 h-1.5 bg-grey-200 rounded-full mx-auto mb-6"></div>

                    <div className="flex justify-between items-end mb-8 px-2">
                        <div>
                            <p className="caption text-grey-400 mb-1">TOTAL PAYABLE</p>
                            <h1 className="text-display text-grey-900">₹{cartTotal.toFixed(0)}<span className="text-2xl text-grey-400 font-medium">.00</span></h1>
                        </div>
                        <div className="text-right">
                            <div className="pill pill-success mb-2">Free Checkout</div>
                            <p className="text-xs text-grey-400">Incl. Taxes</p>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary w-full py-5 text-xl shadow-primary flex justify-between items-center px-8 rounded-2xl group"
                        onClick={() => navigate('/payment-method')}
                    >
                        <span className="font-bold">Checkout</span>
                        <div className="bg-white/20 p-2.5 rounded-full group-hover:bg-white/30 transition-colors">
                            <ChevronRight size={24} className="text-white" />
                        </div>
                    </button>
                </div>
            )}

            {/* Nav spacer if empty */}
            {cart.length === 0 && <BottomNav />}
        </div>
    );
};

export default Cart;
