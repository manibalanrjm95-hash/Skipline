import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, CreditCard, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { redirectToUPI } from '../utils/UPIIntentHandler';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const { cartTotal, currentShop, currentOrderId, checkout } = useStore();
    const [selectedMethod, setSelectedMethod] = useState('qr'); // 'qr' or 'pos'

    const handleConfirmPayment = async () => {
        if (!currentOrderId) {
            const result = await checkout();
            if (!result.success) {
                alert("Failed to create order. Please try again.");
                return;
            }
        }

        if (selectedMethod === 'qr') {
            const mockOrder = { total_amount: cartTotal, id: currentOrderId };
            redirectToUPI(currentShop, mockOrder);
            setTimeout(() => navigate('/payment-qr'), 1000);
        } else {
            navigate('/payment-counter');
        }
    };

    return (
        <div className="m3-scaffold">
            {/* M3 Top App Bar */}
            <header className="m3-top-app-bar shadow-sm">
                <button
                    className="w-10 h-10 flex items-center justify-center state-layer rounded-full"
                    onClick={() => navigate('/cart')}
                >
                    <ArrowLeft size={24} className="text-grey-900" />
                </button>
                <h2 className="title-large text-grey-900">Payment</h2>
            </header>

            <main className="m3-content">
                {/* Total Payable Summary Card (Filled) */}
                <div className="m3-card card-filled flex flex-col items-center text-center p-8 mb-8">
                    <p className="label-medium text-grey-500 uppercase tracking-widest mb-2">Total Payable</p>
                    <h1 className="display-medium text-grey-900 mb-2">₹{Number(cartTotal || 0).toFixed(0)}</h1>
                    <div className="m3-chip bg-md-sys-color-primary-container text-md-sys-color-on-primary-container border-none h-6 px-3">
                        <ShieldCheck size={14} className="mr-2" />
                        <span className="text-[10px] font-bold">SECURE CHECKOUT</span>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="title-medium text-grey-900 mb-4">Choose Payment Mode</p>

                    {/* Simplified M3 Segmented Button Logic using Cards/Buttons */}
                    <div className="flex w-full bg-md-sys-color-surface-variant rounded-full p-1 border border-md-sys-color-outline-variant">
                        <button
                            onClick={() => setSelectedMethod('qr')}
                            className={`flex-1 h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${selectedMethod === 'qr'
                                    ? 'bg-md-sys-color-primary text-white shadow-md'
                                    : 'text-grey-600'
                                }`}
                        >
                            <QrCode size={20} />
                            Pay via UPI
                        </button>
                        <button
                            onClick={() => setSelectedMethod('pos')}
                            className={`flex-1 h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${selectedMethod === 'pos'
                                    ? 'bg-md-sys-color-primary text-white shadow-md'
                                    : 'text-grey-600'
                                }`}
                        >
                            <CreditCard size={20} />
                            At Counter
                        </button>
                    </div>
                </div>

                {/* Method Description Card (Elevated) */}
                <div className="m3-card card-elevated mb-12">
                    <h3 className="title-medium text-grey-900 mb-2">
                        {selectedMethod === 'qr' ? 'UPI Deep Link' : 'Counter Payment'}
                    </h3>
                    <p className="body-medium text-grey-600">
                        {selectedMethod === 'qr'
                            ? 'Tap confirm to open your favorite UPI app (GPay, PhonePe, etc.) to complete the payment.'
                            : 'Visit the store counter and show your order ID to pay via Cash, Card, or Store QR.'}
                    </p>
                </div>

                <div className="mt-auto">
                    <button
                        className="m3-btn btn-filled w-full h-16 text-lg font-bold shadow-lg"
                        onClick={handleConfirmPayment}
                    >
                        CONFIRM & CONTINUE
                    </button>
                    <p className="label-medium text-grey-400 text-center mt-4 uppercase tracking-widest">
                        Secured by SkipLine Payments
                    </p>
                </div>
            </main>
        </div>
    );
};

export default PaymentMethod;
