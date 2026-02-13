import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Wallet, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const PaymentMethod = () => {
    const [method, setMethod] = useState('UPI');
    const { cartTotal } = useStore();
    const navigate = useNavigate();

    const paymentOptions = [
        { id: 'UPI', name: 'UPI Payment', description: 'GPay, PhonePe, Paytm', icon: Wallet },
        { id: 'COUNTER', name: 'Cash at Counter', description: 'Pay with physical cash', icon: CreditCard },
    ];

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
                    <h1 className="headline-small text-md-sys-color-on-surface">Payment</h1>
                </div>
            </header>

            <main className="m3-content flex flex-col gap-8 pb-48">
                {/* M3 Summary Card */}
                <div className="m3-card card-filled bg-md-sys-color-primary-container text-md-sys-color-on-primary-container flex flex-col items-center justify-center py-10 text-center shadow-md">
                    <p className="label-medium font-bold uppercase tracking-[0.2em] opacity-80">Total Payable</p>
                    <h2 className="display-medium font-bold">{formatCurrency(cartTotal)}</h2>
                </div>

                <div>
                    <p className="label-large text-md-sys-color-on-surface-variant uppercase tracking-widest mb-4 px-1">Select Method</p>
                    <div className="flex flex-col gap-3">
                        {paymentOptions.map((opt) => (
                            <button
                                key={opt.id}
                                className={`m3-card w-full flex items-center justify-between transition-all state-layer border-2 ${method === opt.id ? 'border-md-sys-color-primary bg-md-sys-color-surface' : 'border-md-sys-color-outline-variant bg-md-sys-color-surface'
                                    }`}
                                onClick={() => setMethod(opt.id)}
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${method === opt.id ? 'bg-md-sys-color-primary text-white' : 'bg-md-sys-color-surface-variant text-md-sys-color-on-surface-variant'
                                        }`}>
                                        <opt.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="title-medium text-md-sys-color-on-surface">{opt.name}</p>
                                        <p className="body-small text-md-sys-color-on-surface-variant">{opt.description}</p>
                                    </div>
                                </div>
                                {method === opt.id && (
                                    <div className="w-8 h-8 rounded-full bg-md-sys-color-primary-container flex items-center justify-center text-md-sys-color-on-primary-container">
                                        <CheckCircle2 size={24} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* M3 Bottom Bar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-md-sys-color-surface p-6 z-[100] border-t border-md-sys-color-outline-variant">
                <button
                    className="m3-btn btn-filled h-16 text-lg font-bold shadow-lg flex justify-between items-center px-8"
                    onClick={() => navigate('/checkout')}
                >
                    <span>CONFIRM ORDER</span>
                    <ChevronRight size={24} />
                </button>
            </div>

            <BottomNav />
        </div>
    );
};

export default PaymentMethod;
