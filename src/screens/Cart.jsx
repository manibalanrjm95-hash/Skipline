import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, ShoppingBag, Trash2, Minus, Plus, Zap, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const Cart = () => {
    const { cart, cartTotal, updateQuantity } = useStore();
    const navigate = useNavigate();

    return (
        <div className="app-container mesh-bg flex flex-col">
            <div className="screen-padding flex-1 animate-fade flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                    <button className="btn p-3 bg-white rounded-md shadow-sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} className="text-grey-900" />
                    </button>
                    <h2 className="font-bold">My Shopping Cart</h2>
                </div>

                {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 animate-fade">
                        <div className="p-8 rounded-full bg-grey-100 text-grey-300">
                            <ShoppingBag size={80} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-grey-900 mb-2">Cart is empty</h3>
                            <p className="body-sm text-grey-500 max-w-xs mx-auto">Looks like you haven't scanned anything yet. Time to explore the aisles!</p>
                        </div>
                        <button
                            className="btn btn-primary px-8"
                            onClick={() => navigate('/scan')}
                        >
                            Start Scanning
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 pb-8" style={{ maxHeight: 'calc(100vh - 380px)' }}>
                            {cart.map((item) => (
                                <div key={item.product_id} className="card glass flex items-center justify-between p-4 animate-fade">
                                    <div className="flex flex-col gap-1">
                                        <p className="body-sm font-bold text-grey-900">{item.product_name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="caption text-grey-500 font-medium">₹{item.price} per unit</span>
                                            <span className="p-1 rounded bg-grey-100 text-[10px] font-bold">x{item.quantity}</span>
                                        </div>
                                        <p className="body-sm text-primary font-extrabold mt-1">₹{item.subtotal.toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center gap-2 bg-white rounded-xl p-1 border shadow-sm">
                                        <button
                                            className="btn p-2 bg-grey-100 rounded-lg hover:bg-grey-200 transition-colors"
                                            onClick={() => updateQuantity(item.product_id, -1)}
                                        >
                                            {item.quantity === 1 ? <Trash2 size={16} className="text-error" /> : <Minus size={16} />}
                                        </button>
                                        <span className="body-sm font-extrabold" style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button
                                            className="btn p-2 bg-grey-100 rounded-lg hover:bg-grey-200 transition-colors"
                                            onClick={() => updateQuantity(item.product_id, 1)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Pull-up */}
                        <div className="mt-auto card-premium glass flex flex-col gap-4 animate-fade" style={{ borderRadius: '28px 28px 0 0', margin: '0 -24px -24px', padding: '32px 24px' }}>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <p className="body-lg font-bold text-grey-900">Total payable</p>
                                    <Zap size={16} className="text-primary" />
                                </div>
                                <h1 className="text-primary">₹{cartTotal.toFixed(2)}</h1>
                            </div>

                            <div className="flex flex-col gap-3 mb-4">
                                <div className="flex justify-between items-center opacity-60">
                                    <span className="body-sm">Convenience Fee</span>
                                    <span className="body-sm font-bold text-success">FREE</span>
                                </div>
                                <div className="flex justify-between items-center opacity-60">
                                    <span className="body-sm">GST (Included)</span>
                                    <span className="body-sm font-bold">₹0.00</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-full py-5 text-lg gap-2"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout <ChevronRight size={20} />
                            </button>
                        </div>
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
};

export default Cart;
