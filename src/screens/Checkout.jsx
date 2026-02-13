import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle, Loader2, Zap, Lock } from 'lucide-react';

const Checkout = () => {
    const { cartTotal, checkout } = useStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const result = await checkout();
            if (result.success) {
                navigate('/exit', { state: { orderId: result.orderId } });
            } else {
                alert(result.error); // Basic fallback for checkout errors
            }
        } catch (err) {
            console.error('Payment error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container mesh-bg flex flex-col">
            <div className="screen-padding flex-1 animate-fade">
                <div className="flex items-center gap-4 mb-8">
                    <button className="btn p-3 bg-white rounded-md shadow-sm" onClick={() => navigate(-1)} disabled={loading}>
                        <ArrowLeft size={24} className="text-grey-900" />
                    </button>
                    <h2 className="font-bold">Checkout</h2>
                </div>

                <div className="card-premium glass flex flex-col gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg text-white">
                            <Zap size={20} />
                        </div>
                        <h3 className="font-bold">Order Summary</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-grey-500">
                            <p className="body-sm font-medium">Subtotal</p>
                            <p className="body-sm font-bold text-grey-900">₹{cartTotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center text-grey-500">
                            <p className="body-sm font-medium">Processing Fee</p>
                            <p className="body-sm font-bold text-success">₹0.00</p>
                        </div>
                        <div className="border-b" style={{ borderStyle: 'dashed' }}></div>
                        <div className="flex justify-between items-center py-2">
                            <p className="body-lg font-bold text-grey-900">Total Amount</p>
                            <h2 className="text-primary font-extrabold">₹{cartTotal.toFixed(2)}</h2>
                        </div>
                    </div>
                </div>

                <div className="card glass flex flex-col gap-4 mb-8">
                    <p className="caption text-grey-500 font-bold">PAYMENT OPTION</p>
                    <div className="flex items-center gap-4 p-4 bg-blue-light rounded-xl" style={{ border: '2px solid var(--color-secondary)' }}>
                        <div className="p-3 bg-secondary rounded-lg text-white shadow-md">
                            <CreditCard size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="body-sm font-extrabold text-grey-900">SkipLine QuickPay</p>
                            <p className="caption text-grey-500 font-medium">Verified Wallet Balance: ₹5,000.00</p>
                        </div>
                        <CheckCircle size={24} className="text-secondary" />
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-6">
                    <div className="flex items-center justify-center gap-2 text-grey-400">
                        <Lock size={16} />
                        <p className="caption font-bold">256-BIT SSL SECURED ENCRYPTION</p>
                    </div>

                    <button
                        className="btn btn-primary w-full py-5 text-lg"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="animate-spin" size={24} />
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            `Pay ₹${cartTotal.toFixed(2)}`
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 opacity-50">
                        <ShieldCheck size={16} />
                        <span className="caption font-medium">Guaranteed by SkipLine Trust</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
