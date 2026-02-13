import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, CreditCard, ChevronRight, Zap, X, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { redirectToUPI } from '../utils/UPIIntentHandler';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const { cartTotal, currentShop, currentOrderId, checkout } = useStore();
    const [showAppsModal, setShowAppsModal] = useState(false);

    // Initialize checkout if not already done (in case they came directly or skipped)
    // Actually, checkout() creates the order. We should probably do that BEFORE this screen or ON this screen.
    // SECTION 6 says "Checkout Flow". Usually Checkout -> Payment.
    // StoreContext has checkout(). Let's assume it was called in Cart or we call it here if no orderId.
    // For now, aligning UI.

    const handleAppSelect = (app) => {
        const mockOrder = {
            total_amount: cartTotal,
            id: currentOrderId
        };

        if (currentShop && currentOrderId) {
            redirectToUPI(currentShop, mockOrder);
            setTimeout(() => {
                alert("If payment app did not open, please scan store QR manually.");
            }, 1500);
            setTimeout(() => navigate('/payment-qr'), 2500);
        } else {
            // Safety fallback
            navigate('/payment-qr');
        }
    };

    const handleMethodClick = async (method) => {
        if (!currentOrderId) {
            // ensure order is created
            const result = await checkout();
            if (!result.success) {
                alert("Failed to create order. Please try again.");
                return;
            }
        }

        if (method.id === 'qr') {
            handleAppSelect(); // Try auto-open first? Or show modal?
            // User requested "Tap triggers UPI deep link".
            // So we should try to open specific app or generic intent.
            // Let's standardly showing the options or just triggering generic.
            // Let's trigger generic intent via redirectToUPI immediately for best UX, then fall back to QR screen.
            const mockOrder = { total_amount: cartTotal, id: currentOrderId };
            redirectToUPI(currentShop, mockOrder);
            setTimeout(() => navigate('/payment-qr'), 1000); // Navigate to QR screen for "I have paid"
        } else {
            navigate(method.path);
        }
    };

    return (
        <div className="app-container mesh-bg flex flex-col h-screen">
            <div className="screen-padding flex-1 animate-fade flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                    <button className="btn p-3 bg-white rounded-full shadow-sm" onClick={() => navigate('/cart')}>
                        <ArrowLeft size={24} className="text-grey-900" />
                    </button>
                    <h2 className="font-extrabold text-2xl text-grey-900">Payment</h2>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-grey-100 mb-8 flex flex-col items-center text-center">
                    <p className="caption text-grey-500 font-bold mb-2 uppercase tracking-widest">TOTAL PAYABLE</p>
                    <h1 className="text-5xl text-grey-900 font-extrabold mb-2">₹{Number(cartTotal || 0).toFixed(0)}<span className="text-2xl text-grey-400">.00</span></h1>
                    <div className="flex items-center gap-1 text-success bg-success-light px-3 py-1 rounded-full">
                        <ShieldCheck size={14} />
                        <span className="text-xs font-bold">Secure Checkout</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="caption text-grey-500 font-bold ml-1 uppercase tracking-widest">SELECT PAYMENT MODE</p>

                    <button
                        onClick={() => handleMethodClick({ id: 'qr' })}
                        className="bg-primary text-white rounded-2xl p-6 shadow-primary active:scale-95 transition-transform flex items-center justify-between group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <QrCode size={32} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg">Pay via UPI App</h3>
                                <p className="text-white/80 text-sm font-medium">Google Pay, PhonePe, Paytm</p>
                            </div>
                        </div>
                        <ChevronRight size={24} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                        onClick={() => handleMethodClick({ id: 'pos', path: '/payment-counter' })}
                        className="bg-white text-grey-900 rounded-2xl p-6 shadow-sm border border-grey-200 active:scale-95 transition-transform flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-grey-100 p-3 rounded-xl">
                                <CreditCard size={32} className="text-grey-700" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg">Pay at Counter</h3>
                                <p className="text-grey-500 text-sm font-medium">Cash or Card</p>
                            </div>
                        </div>
                        <ChevronRight size={24} className="text-grey-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            </div>

            <div className="p-6 text-center">
                <p className="caption text-grey-400">Secured by SkipLine Payments</p>
            </div>
        </div>
    );
};

export default PaymentMethod;
