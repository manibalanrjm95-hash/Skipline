import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, CreditCard, ChevronRight, Zap, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getUPIIntent, launchUPIIntent } from '../utils/UPIIntentHandler';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const { cartTotal, currentShop, currentOrderId } = useStore();
    const [showAppsModal, setShowAppsModal] = useState(false);

    const upiApps = [
        { name: 'Google Pay', id: 'gpay', color: '#4285F4', bg: 'rgba(66, 133, 244, 0.1)' },
        { name: 'PhonePe', id: 'phonepe', color: '#5f259f', bg: 'rgba(95, 37, 159, 0.1)' },
        { name: 'Paytm', id: 'paytm', color: '#00BAF2', bg: 'rgba(0, 186, 242, 0.1)' }
    ];

    const handleAppSelect = (app) => {
        const intent = getUPIIntent({
            vpa: currentShop?.vpa,
            name: currentShop?.shop_name,
            amount: cartTotal,
            orderId: currentOrderId
        });

        if (intent) {
            launchUPIIntent(intent);
            // After launching intent, go to verification screen
            setTimeout(() => navigate('/payment-qr'), 1000);
        } else {
            navigate('/payment-qr');
        }
    };

    const handleMethodClick = (method) => {
        if (method.id === 'qr') {
            setShowAppsModal(true);
        } else {
            navigate(method.path);
        }
    };

    const methods = [
        {
            id: 'qr',
            title: 'Scan Store QR',
            desc: 'Pay using UPI Apps or Scan QR',
            icon: QrCode,
            color: 'var(--color-primary)',
            bg: 'var(--color-primary-glow)',
            path: '/payment-qr'
        },
        {
            id: 'pos',
            title: 'Pay at Counter',
            desc: 'Cash or POS at the entrance',
            icon: CreditCard,
            color: 'var(--color-secondary)',
            bg: 'var(--color-secondary-glow)',
            path: '/payment-counter'
        }
    ];

    return (
        <div className="app-container mesh-bg flex flex-col">
            <div className="screen-padding flex-1 animate-fade">
                <div className="flex items-center gap-4 mb-8">
                    <button className="btn p-3 bg-white rounded-md shadow-sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={24} className="text-grey-900" />
                    </button>
                    <h2 className="font-bold">Payment Method</h2>
                </div>

                <div className="card-premium glass flex flex-col gap-4 mb-10 border-l-4 border-l-primary">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="caption text-grey-500 font-extrabold text-[10px] tracking-wider">TOTAL PAYABLE</p>
                            <h1 className="text-primary text-3xl">₹{Number(cartTotal || 0).toFixed(2)}</h1>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-4 rounded-3xl">
                            <Zap size={28} className="text-primary" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="caption text-grey-500 font-bold ml-1 uppercase tracking-widest text-[11px]">Choose how to pay</p>
                    {methods.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => handleMethodClick(m)}
                            className="card-premium glass flex items-center gap-5 p-6 hover:translate-x-2 transition-transform border-none text-left w-full group overflow-hidden relative"
                        >
                            <div className="p-4 rounded-2xl relative z-10" style={{ background: m.bg, color: m.color }}>
                                <m.icon size={28} />
                            </div>
                            <div className="flex-1 relative z-10">
                                <h3 className="text-grey-900 font-extrabold">{m.title}</h3>
                                <p className="body-sm text-grey-500 font-medium">{m.desc}</p>
                            </div>
                            <ChevronRight size={20} className="text-grey-300 group-hover:text-primary transition-colors relative z-10" />
                            {m.id === 'qr' && (
                                <div className="absolute top-0 right-0 p-2 opacity-20">
                                    <Zap size={40} className="text-primary" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-10 p-5 bg-grey-100 bg-opacity-50 rounded-2xl border border-dashed border-grey-300 text-center">
                    <p className="caption text-grey-500 font-bold italic">No physical cash is accepted via app.<br />Please verify payment with staff after transfer.</p>
                </div>
            </div>

            {/* UPI Apps Modal */}
            {showAppsModal && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-grey-900 bg-opacity-50 backdrop-blur-sm transition-all animate-fade">
                    <div className="bg-white rounded-t-[40px] p-8 animate-slide-up shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-extrabold text-grey-900">Choose App</h2>
                                <p className="body-sm text-grey-500 font-medium">Select a UPI app to pay ₹{Number(cartTotal).toFixed(2)}</p>
                            </div>
                            <button
                                className="btn p-3 bg-grey-100 rounded-full text-grey-400"
                                onClick={() => setShowAppsModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {upiApps.map(app => (
                                <button
                                    key={app.id}
                                    className="flex flex-col items-center gap-3 group"
                                    onClick={() => handleAppSelect(app)}
                                >
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-active:scale-90" style={{ background: app.color }}>
                                        {app.name[0]}
                                    </div>
                                    <span className="caption font-bold text-grey-900">{app.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="h-[1px] bg-grey-100 w-full mb-1"></div>
                            <button
                                className="btn glass w-full py-5 flex items-center justify-center gap-3 border-grey-200"
                                onClick={() => navigate('/payment-qr')}
                            >
                                <QrCode size={20} className="text-primary" />
                                <span className="font-extrabold text-grey-900">Manual QR Scan</span>
                            </button>
                            <p className="caption text-center text-grey-400 font-bold">USE THIS IF APPS DON'T OPEN AUTOMATICALLY</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethod;
