import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Wallet, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const PaymentMethod = () => {
    const [method, setMethod] = useState('UPI'); // Default to UPI
    const { cartTotal } = useStore();
    const navigate = useNavigate();

    const paymentOptions = [
        { id: 'UPI', name: 'UPI Payment', description: 'GPay, PhonePe, Paytm', icon: Wallet },
        { id: 'COUNTER', name: 'Cash at Counter', description: 'Pay with physical cash', icon: CreditCard },
    ];

    const formatCurrency = (amount) => {
        const value = Number(amount);
        return isNaN(value) ? '₹0.00' : `₹${value.toFixed(2)}`;
    };

    return (
        <div className="max-app-width flex flex-col bg-bg-app">
            <header className="page-padding pt-8 pb-4 bg-bg-app sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        className="w-10 h-10 flex items-center justify-center text-text-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="h1 text-text-primary">Payment</h1>
                </div>
            </header>

            <main className="page-padding section-gap pb-48">
                {/* Total Summary Card */}
                <div className="card-v2 bg-secondary text-white border-none flex flex-col gap-1 items-center justify-center py-8 text-center ring-4 ring-secondary/10">
                    <p className="label font-bold uppercase tracking-[0.2em] opacity-80 text-white">Total Payable</p>
                    <h2 className="h1 text-white" style={{ fontSize: '36px' }}>{formatCurrency(cartTotal)}</h2>
                </div>

                <div>
                    <p className="label text-text-secondary uppercase tracking-widest mb-4 px-1">Select Payment Method</p>
                    <div className="flex flex-col gap-3">
                        {paymentOptions.map((opt) => (
                            <button
                                key={opt.id}
                                className={`card-v2 w-full flex items-center justify-between transition-all border-2 ${method === opt.id ? 'border-secondary shadow-md' : 'border-border'
                                    }`}
                                onClick={() => setMethod(opt.id)}
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${method === opt.id ? 'bg-secondary text-white' : 'bg-bg-app text-text-secondary border border-border'
                                        }`}>
                                        <opt.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="body font-bold text-text-primary">{opt.name}</p>
                                        <p className="small text-text-secondary">{opt.description}</p>
                                    </div>
                                </div>
                                {method === opt.id && (
                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <CheckCircle2 size={24} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Action */}
            <div className="sticky-bar-v2 flex flex-col gap-6">
                <button
                    className="btn-v2 btn-v2-primary flex justify-between items-center px-8"
                    onClick={() => navigate('/checkout')}
                >
                    <span>Confirm Order</span>
                    <ChevronRight size={24} />
                </button>
            </div>

            <BottomNav />
        </div>
    );
};

export default PaymentMethod;
